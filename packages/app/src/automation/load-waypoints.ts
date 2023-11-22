import {prisma, Server, ExploreStatus} from "@common/prisma";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import createApi from "@common/lib/createApi";
import {environmentVariables} from "@common/environment-variables";
import {Waypoint} from "spacetraders-sdk";
import {backgroundQueue} from "@auto/lib/queue";
import {storeWaypointScan} from "@common/lib/data-update/store-waypoint-scan";
import {storeMarketInformation} from "@common/lib/data-update/store-market-information";
import {storeJumpGateInformation} from "@common/lib/data-update/store-jump-gate";

export const loadWaypoint = async (server: Server) => {
  const token = await getBackgroundAgentToken(server)
  const api = createApi(token)

  const hq = await prisma.$queryRaw<{ x: number, y: number }[]>`SELECT *
                                                                FROM "System" s
                                                                         INNER JOIN "Ship" sh ON sh."currentSystemSymbol" = s.symbol
                                                                WHERE sh.symbol = ${environmentVariables.agentName + '-1'} LIMIT 1`

  const systems = await prisma.$queryRaw<{ name: string, symbol: string }[]>`SELECT * FROM "System" s WHERE "waypointsRetrieved" = false ORDER BY SQRT(POW(ABS(s.x - ${hq[0].x}), 2) + POW(ABS(s.y - ${hq[0].y}), 2)) ASC`
  console.log("Loading waypoint information for all unscanned systems")
  let i = 0;
  for (const system of systems) {
    i++

    try {
      const allWaypoints: Waypoint[] = []
      let page = 1

      let waypoints = await backgroundQueue(async () => api.systems.getSystemWaypoints(system.symbol, page, 20))
      await storeWaypointScan(system.symbol, waypoints.data)
      allWaypoints.push(...waypoints.data.data)
      while (waypoints.data.meta.total >= page * 20) {
        page++
        waypoints = await backgroundQueue(async () => api.systems.getSystemWaypoints(system.symbol, page, 20))
        await storeWaypointScan(system.symbol, waypoints.data)
        allWaypoints.push(...waypoints.data.data)
      }

      console.log(`${i}/${systems.length}: got all waypoints for ${system.name} (${system.symbol}): ${allWaypoints.length}`)

      for (const waypoint of allWaypoints) {
        const isMarketplace = waypoint.traits.find(t => t.symbol === 'MARKETPLACE')
        const isCharted = waypoint.chart?.submittedBy !== undefined
        if (isMarketplace) {
          const marketInfo = await backgroundQueue(async () => api.systems.getMarket(system.symbol, waypoint.symbol))
          await storeMarketInformation(marketInfo.data)
        }
        if (isCharted && !isMarketplace) {
          await prisma.waypoint.update({
            where: {
              symbol: waypoint.symbol
            },
            data: {
              exploreStatus: ExploreStatus.EXPLORED
            }
          })
        }
        if (waypoint.type === 'JUMP_GATE' && isCharted) {
          const gateInfo = await backgroundQueue(async () => api.systems.getJumpGate(system.symbol, waypoint.symbol))
          await storeJumpGateInformation(system.symbol, waypoint.symbol, gateInfo.data)
        }
      }

    } catch (error) {
      console.error('failure loading waypoints', error)
    }

  }
}
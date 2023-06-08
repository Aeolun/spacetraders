import {Ship} from "@app/ship/ship";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";
import {logShipAction} from "@app/lib/log";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {prisma, Prisma} from "@app/prisma";
import {storeWaypoint} from "@app/ship/storeResults";
import {travelBehavior} from "@app/ship/behaviors/travel-behavior";
import {getDistance} from "@common/lib/getDistance";
import {defaultWayfinder} from "@app/wayfinding";

const jumpMapTaken = new Set([] as string[])

export const mapJumpgatesBehavior = async (shipReg: string) => {
    const token = await getBackgroundAgentToken()
    const ship = new Ship(token, 'PHANTASM', shipReg)

    let started = false

    while(true) {
        try {
            if (!started) {
                await ship.validateCooldowns()
                await ship.updateShipStatus()

                started = true
            }

            const system = await prisma.system.findFirstOrThrow({
                where: {
                    symbol: ship.currentSystemSymbol
                }
            })



                const list = await prisma.$queryRaw<{
                    symbol: string,
                    distance: number,
                    connectedSystemCount: number
                }[]>`
                    SELECT s.symbol,
                           MAX(SQRT(POW(s.x - ${system.x}, 2) + POW(s.y - ${system.y}, 2))) as distance,
                           COUNT(cnt.distance) connectedSystemCount
                    FROM Waypoint wp
                             LEFT JOIN JumpConnectedSystem cnt ON cnt.fromWaypointSymbol = wp.symbol
                             INNER JOIN \`System\` s ON
                        wp.systemSymbol = s.symbol
                    WHERE s.hasJumpGate = true and s.symbol NOT IN(${Prisma.join(jumpMapTaken.size > 0 ? [...jumpMapTaken.values()] : ['stuff'])})
                    GROUP BY s.symbol
                    HAVING connectedSystemCount = 0
                    ORDER BY connectedSystemCount ASC, distance ASC LIMIT 50;`

            ship.log(`Found ${list.length} systems to map jump routes for`)

            const explorable = list.filter(system => {
                return !jumpMapTaken.has(system.symbol)
            })
            if (explorable.length <= 0) {
                ship.log(`No systems to map jumps for`)
                await ship.waitFor(30000)
                continue;
            }

            // try to explore current system first if still available
            let exploreSystem = explorable.find(s => s.symbol === ship.currentSystemSymbol)
            if (!exploreSystem) {
                exploreSystem = explorable[0]
            }
            ship.log(`Reserving ${exploreSystem.symbol} to find jump connections for`)
            jumpMapTaken.add(exploreSystem.symbol)
            await ship.setOverallGoal(`Map jump-gate in ${exploreSystem.symbol}`)

            let explorableWaypoints = await prisma.waypoint.findMany({
                where: {
                    systemSymbol: exploreSystem.symbol,
                    type: 'JUMP_GATE'
                }
            })

            const success = await travelBehavior(exploreSystem.symbol, ship, explorableWaypoints[0].symbol)
            if (!success) {
                ship.log(`Failed to navigate to ${exploreSystem.symbol}`)
                continue;
            }

            ship.log(`Arrived at ${exploreSystem.symbol} for charting jump gate.`)

            // assume only one gate per system
            const wp = explorableWaypoints[0]

            await ship.navigate(wp.symbol)
            const chartResult = await ship.chart()

            const hasShipyard = chartResult.waypoint.traits.some(t => t.symbol === 'SHIPYARD')
            const hasMarketplace = chartResult.waypoint.traits.some(t => t.symbol === 'MARKETPLACE')
            if (hasMarketplace || hasShipyard) {
                await ship.dock()
                if (hasMarketplace) {
                    await ship.market()
                }
                if (hasShipyard) {
                    await ship.shipyard()
                }
                await ship.orbit()
            }

            if (chartResult.waypoint.type === 'JUMP_GATE') {
                await ship.jumpgate()
                await defaultWayfinder.loadWaypoints()
            }

            ship.log(`Finished mapping jumps in ${exploreSystem.symbol}`)
            jumpMapTaken.delete(exploreSystem.symbol)
            await ship.setOverallGoal(null)
        } catch(error) {
            console.log("Unexpected issue in agent, restarting: ",error?.response?.data ? error?.response?.data : error)
            started = false
        }
    }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}
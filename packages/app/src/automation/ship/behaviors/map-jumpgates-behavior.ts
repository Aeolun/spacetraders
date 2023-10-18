import {Ship} from "@auto/ship/ship";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";
import {logShipAction} from "@auto/lib/log";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {prisma, Prisma} from "@common/prisma";
import {travelBehavior} from "@auto/ship/behaviors/travel-behavior";
import {getDistance} from "@common/lib/getDistance";
import {defaultWayfinder} from "@auto/wayfinding";
import {BehaviorParameters} from "@auto/ship/shipBehavior";
import {storeWaypoint} from "@common/lib/data-update/store-waypoint";

const jumpMapTaken = new Set([] as string[])

export const mapJumpgatesBehavior = async (ship: Ship, parameters: BehaviorParameters) => {
    const system = await prisma.system.findFirstOrThrow({
        where: {
            symbol: parameters.systemSymbol
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
        return;
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

    const success = await travelBehavior(exploreSystem.symbol, ship, explorableWaypoints[0].symbol, {
        jumpOnly: true
    })
    if (!success) {
        ship.log(`Failed to navigate to ${exploreSystem.symbol}`)
        return;
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
}
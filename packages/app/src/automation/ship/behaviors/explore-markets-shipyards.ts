import {Ship} from "@auto/ship/ship";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";
import {logShipAction} from "@auto/lib/log";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {prisma, Prisma} from "@auto/prisma";
import {travelBehavior} from "@auto/ship/behaviors/travel-behavior";
import {BehaviorParameters} from "@auto/ship/shipBehavior";
import {storeWaypoint} from "@auto/ship/data-update/store-waypoint";

const updateTaken = new Set([] as string[])
const shitList: {
    system: string
    expire: number
}[] = [{
    system: 'garbage',
    expire: Number.MAX_SAFE_INTEGER
}]

export const exploreNewMarkets = async (ship: Ship, parameters: BehaviorParameters) => {
            const system = await prisma.system.findFirstOrThrow({
                where: {
                    symbol: parameters.systemSymbol
                }
            })

            const currentLocation = await prisma.system.findFirstOrThrow({
                where: {
                    symbol: ship.currentSystemSymbol
                }
            })

            ship.log(`Current location x ${currentLocation.x}, y ${currentLocation.y}`)
            let list = await prisma.$queryRaw<{
                symbol: string,
                distance: number,
                waypointCount: number
            }[]>`
                SELECT s.symbol,
                       MIN(mp.updatedOn) lastUpdated,
                       MAX(SQRT(POW(s.x - ${currentLocation.x}, 2) + POW(s.y - ${currentLocation.y}, 2))) as distance,
                       COUNT(wp.symbol) waypointCount
                FROM Waypoint wp
                    INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'MARKETPLACE'
                         INNER JOIN \`System\` s ON
                            wp.systemSymbol = s.symbol
                    LEFT JOIN MarketPrice mp ON wp.symbol = mp.waypointSymbol
                WHERE
                    s.hasJumpGate = true
                    and s.x > -20000 and s.x < 20000
                    and s.y > -20000 and s.y < 20000
                    and s.symbol NOT IN(${Prisma.join(shitList.map(s => s.system))})
                GROUP BY s.symbol
                HAVING MIN(mp.updatedOn) IS NULL
                ORDER BY waypointCount DESC, distance ASC LIMIT 100;`

            ship.log(`Found ${list.length} systems that have no market information yet, even though there is a marketplace`)

            let updatable = list.filter(system => {
                return !updateTaken.has(system.symbol)
            })

            if (updatable.length === 0) {
                // find system that has been updated furthest back
                list = await prisma.$queryRaw<{
                    symbol: string,
                    distance: number,
                    waypointCount: number
                }[]>`
                SELECT s.symbol,
                       MIN(mp.updatedOn) lastUpdated,
                       MAX(SQRT(POW(s.x - ${currentLocation.x}, 2) + POW(s.y - ${currentLocation.y}, 2))) as distance,
                       COUNT(wp.symbol) waypointCount
                FROM Waypoint wp
                    INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'MARKETPLACE'
                         INNER JOIN \`System\` s ON
                            wp.systemSymbol = s.symbol
                    LEFT JOIN MarketPrice mp ON wp.symbol = mp.waypointSymbol
                WHERE
                    s.hasJumpGate = true
                    and s.x > ${system.x - parameters.range}
                    and s.x < ${system.x + parameters.range}
                    and s.y > ${system.y - parameters.range}
                    and s.y < ${system.y + parameters.range}
                GROUP BY s.symbol
                HAVING MIN(mp.updatedOn) < NOW() - INTERVAL 3 HOUR
                ORDER BY lastUpdated ASC;`

                updatable = list.filter(system => {
                    return !updateTaken.has(system.symbol)
                })
            }

            if (updatable.length <= 0) {
                ship.log(`No systems to updated market prices for within ${parameters.range} of ${parameters.systemSymbol}, pausing for a bit.`)
                await ship.setOverallGoal(null)
                await ship.waitFor(60000)
                return;
            }

            const updateSystem = updatable[0]
            updateTaken.add(updateSystem.symbol)
            ship.log(`Updating ${updateSystem.waypointCount} new markets in ${updateSystem.symbol}`)
            await ship.setOverallGoal(`Updating ${updateSystem.waypointCount} new markets in ${updateSystem.symbol}`)

            const success = await travelBehavior(updateSystem.symbol, ship, undefined, {
              jumpOnly: true,
            })
            if (!success) {
                ship.log(`Cannot navigate to ${updateSystem.symbol}`)
                shitList.push({
                    system: updateSystem.symbol,
                    expire: Date.now()+86400*30*1000
                })
                return;
            }

            ship.log(`Arrived at ${updateSystem.symbol} for updating ${updateSystem.waypointCount} markets.`)

            const updateableWaypoints = await prisma.waypoint.findMany({
                include: {
                    traits: true
                },
                where: {
                    systemSymbol: updateSystem.symbol,
                    traits: {
                        some: {
                            symbol: {
                                in: ['MARKETPLACE', 'SHIPYARD', 'BLACK_MARKET']
                            },
                        }
                    },
                }
            })

            for(const wp of updateableWaypoints) {
                await ship.navigate(wp.symbol)

                const hasShipyard = wp.traits.some(t => t.symbol === 'SHIPYARD')
                const hasMarketplace = wp.traits.some(t => t.symbol === 'MARKETPLACE')
                if (hasMarketplace || hasShipyard) {
                    const currentShipInfo = await ship.dock()
                    if (hasMarketplace) {
                        const marketInfo = await ship.market()

                        if (marketInfo.tradeGoods.some(t => t.symbol == 'FUEL') && currentShipInfo.fuelAvailable < currentShipInfo.fuelCapacity / 2) {
                            ship.log("Refueling because at less than 50% fuel.")
                            await ship.dock()
                            await ship.refuel()
                        }
                    }
                    if (hasShipyard) {
                        await ship.shipyard()
                    }
                    await ship.orbit()
                }
            }

            ship.log(`Finished updating markets in ${updateSystem.symbol}`)
            updateTaken.delete(updateSystem.symbol)
            await ship.setOverallGoal(null)
}
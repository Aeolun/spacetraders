import {Ship} from "@app/ship/ship";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";
import {logShipAction} from "@app/lib/log";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {prisma, Prisma} from "@app/prisma";
import {storeWaypoint} from "@app/ship/storeResults";
import {travelBehavior} from "@app/ship/behaviors/travel-behavior";

const updateTaken = new Set([] as string[])
const shitList: {
    system: string
    expire: number
}[] = [{
    system: 'garbage',
    expire: Number.MAX_SAFE_INTEGER
}]

export const exploreNewMarkets = async (shipReg: string, aroundSystem: string, range: number) => {
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
                    symbol: aroundSystem
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
                    and s.x > ${system.x - range}
                    and s.x < ${system.x + range}
                    and s.y > ${system.y - range}
                    and s.y < ${system.y + range}
                GROUP BY s.symbol
                HAVING MIN(mp.updatedOn) < NOW() - INTERVAL 3 HOUR
                ORDER BY lastUpdated ASC;`

                updatable = list.filter(system => {
                    return !updateTaken.has(system.symbol)
                })
            }

            if (updatable.length <= 0) {
                ship.log(`No systems to updated market prices for within ${range} of ${aroundSystem}, pausing for a bit.`)
                await ship.setOverallGoal(null)
                await ship.waitFor(60000)
                continue
            }

            const updateSystem = updatable[0]
            updateTaken.add(updateSystem.symbol)
            ship.log(`Updating ${updateSystem.waypointCount} new markets in ${updateSystem.symbol}`)
            await ship.setOverallGoal(`Updating ${updateSystem.waypointCount} new markets in ${updateSystem.symbol}`)

            const success = await travelBehavior(updateSystem.symbol, ship)
            if (!success) {
                ship.log(`Cannot navigate to ${updateSystem.symbol}`)
                shitList.push({
                    system: updateSystem.symbol,
                    expire: Date.now()+86400*30*1000
                })
                continue;
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
        } catch(error) {
            console.log("Unexpected issue in agent, restarting in 60s: ",error?.response?.data ? error?.response?.data : error.toString())
            await ship.setOverallGoal(null)
            await ship.waitFor(60000)
            started = false
        }
    }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}
import {Ship} from "@app/ship/ship";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";
import {logShipAction} from "@app/lib/log";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {prisma, Prisma} from "@app/prisma";
import {storeWaypoint} from "@app/ship/storeResults";
import {travelBehavior} from "@app/ship/behaviors/travel-behavior";
import {getDistance} from "@common/lib/getDistance";
import {defaultWayfinder} from "@app/wayfinding";

const exploreTaken = new Set([] as string[])
const shitList: {
    system: string
    expire: number
}[] = [{
    system: 'garbage',
    expire: Number.MAX_SAFE_INTEGER
}]

export const exploreBehavior = async (shipReg: string, aroundSystem: string, range: number) => {
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
            const currentSystem = await prisma.system.findFirstOrThrow({
                where: {
                    symbol: ship.currentSystemSymbol
                }
            })

            let list: {symbol: string, distance: number, waypointCount: number}[]
            if (ship.hasWarpDrive) {
                list = await prisma.$queryRaw<{
                    symbol: string,
                    distance: number,
                    waypointCount: number
                }[]>`
                    SELECT s.symbol,
                           MAX(SQRT(POW(s.x - ${currentSystem.x}, 2) + POW(s.y - ${currentSystem.y}, 2))) as distance,
                           COUNT(wp.symbol)                                                    waypointCount
                    FROM Waypoint wp
                             INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'UNCHARTED'
                             INNER JOIN \`System\` s ON
                        wp.systemSymbol = s.symbol
                    WHERE s.x > ${system.x - range}
                      and s.x < ${system.x + range}
                      and s.y > ${system.y - range}
                      and s.y < ${system.y + range}
                      and wp.chartSubmittedBy IS NULL
                      and s.symbol NOT IN(${Prisma.join(shitList.map(s => s.system))})
                    GROUP BY s.symbol
                    ORDER BY distance ASC;`
            } else {
                list = await prisma.$queryRaw<{
                    symbol: string,
                    distance: number,
                    waypointCount: number
                }[]>`
                    SELECT s.symbol,
                           MAX(SQRT(POW(s.x - ${currentSystem.x}, 2) + POW(s.y - ${currentSystem.y}, 2))) as distance,
                           COUNT(wp.symbol)                                                    waypointCount
                    FROM Waypoint wp
                             INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'UNCHARTED'
                             INNER JOIN \`System\` s ON
                        wp.systemSymbol = s.symbol
                    WHERE s.x > ${system.x - range}
                      and s.x < ${system.x + range}
                      and s.y > ${system.y - range}
                      and s.y < ${system.y + range}
                      and s.hasJumpGate = true
                      and wp.chartSubmittedBy IS NULL
                      and s.symbol NOT IN(${Prisma.join(shitList.map(s => s.system))})
                    GROUP BY s.symbol
                    ORDER BY distance ASC;`
            }

            ship.log(`Found ${list.length} systems to explore`)

            const explorable = list.filter(system => {
                return !exploreTaken.has(system.symbol)
            })
            if (explorable.length <= 0) {
                ship.log(`No systems to explore within ${range} of ${aroundSystem}, waiting.`)
                await ship.setOverallGoal(null)
                await ship.waitUntil(new Date(Date.now() + 1000 * 60).toISOString())
                continue;
            }

            // try to explore current system first if still available
            let exploreSystem = explorable.find(s => s.symbol === ship.currentSystemSymbol)
            if (!exploreSystem) {
                exploreSystem = explorable[0]
            }
            exploreTaken.add(exploreSystem.symbol)
            await ship.setOverallGoal(`Exploring waypoints in ${exploreSystem.symbol}`)

            ship.log(`Check if ${exploreSystem.symbol} is still uncharted`)

            const systemInfo = await ship.queue(() => ship.api.systems.getSystemWaypoints(exploreSystem.symbol, 1, 20))
            systemInfo.data.data.forEach(wp => {
                storeWaypoint(wp)
            })

            const hasUnchartedTraits = systemInfo.data.data.some(wp => {
                return wp.traits.some(trait => trait.symbol === 'UNCHARTED')
            })
            if (!hasUnchartedTraits) {
                ship.log(`${exploreSystem.symbol} has no more uncharted waypoints, continuing with next system.`)
                await ship.setOverallGoal(null)
                continue;
            }

            let explorableWaypoints = await prisma.waypoint.findMany({
                where: {
                    systemSymbol: exploreSystem.symbol,
                    traits: {
                        some: {
                            symbol: 'UNCHARTED'
                        }
                    }
                }
            })

            const success = await travelBehavior(exploreSystem.symbol, ship, explorableWaypoints[0].symbol)
            if (!success) {
                // cannot find a route or travel to this system
                ship.log(`Couldn't find a route to ${exploreSystem.symbol}, putting it on the shitlist for an hour.`)
                shitList.push({
                    system: exploreSystem.symbol,
                    expire: Date.now() + 3600 * 1000
                })
                continue;
            }

            ship.log(`Arrived at ${exploreSystem.symbol} for charting ${exploreSystem.waypointCount} waypoints.`)

            do {
                const shipData = await prisma.ship.findFirstOrThrow({
                    where: {
                        symbol: ship.symbol
                    },
                    include: {
                        currentWaypoint: true
                    }
                })
                explorableWaypoints.forEach(wp => {
                    wp.distance = getDistance(wp, shipData.currentWaypoint)
                })
                explorableWaypoints.sort((a, b) => {
                    return a.distance > b.distance ? 1 : -1
                })

                // closest waypoint
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


                explorableWaypoints = await prisma.waypoint.findMany({
                    where: {
                        systemSymbol: exploreSystem.symbol,
                        traits: {
                            some: {
                                symbol: 'UNCHARTED'
                            }
                        }
                    }
                })
            } while(explorableWaypoints.length > 0)

            ship.log(`Finished exploring ${exploreSystem.symbol}`)
            exploreTaken.delete(exploreSystem.symbol)
            await ship.setOverallGoal(null)
        } catch(error) {
            console.log("Unexpected issue in agent, restarting after 60s: ",error?.response?.data ? error?.response?.data : error)
            await ship.waitFor(60000)
            started = false
        }
    }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}
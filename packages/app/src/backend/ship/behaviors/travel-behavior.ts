import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {Ship} from "@app/ship/ship";
import {prisma} from "@app/prisma";
import {defaultWayfinder, printRoute} from "@app/wayfinding";
import {LinkedListItem} from "@aeolun/dijkstra-calculator";
import {ShipNavFlightMode} from "spacetraders-sdk";

export async function travelBehavior(toSystem: string, ship: Ship, preferredWaypointSymbol?: string, options?: {
    executeEveryStop?: () => Promise<void>
    jumpOnly?: boolean
}) {
    ship.log(`Traveling to ${toSystem}`)
    await ship.setTravelGoal(toSystem);
    while(true) {
        try {
            if (!ship.currentSystemSymbol) {
                await ship.validateCooldowns()
                await ship.updateShipStatus()
            }

            await options?.executeEveryStop?.()

            if (ship.currentSystemSymbol !== toSystem) {
                let route: LinkedListItem[] = []
                if (ship.hasWarpDrive && !options?.jumpOnly) {
                    const result = await defaultWayfinder.findRoute(ship.currentSystemSymbol, toSystem, {
                        max: ship.maxFuel,
                        current: ship.fuel
                    })
                    route = result.finalPath
                    printRoute(route, result.pathProperties)
                } else {
                    const result = await defaultWayfinder.findJumpRoute(ship.currentSystemSymbol, toSystem, {
                        max: ship.maxFuel,
                        current: ship.fuel
                    })
                    route = result.finalPath
                    printRoute(route, result.pathProperties)
                }

                if (route.length <= 0) {
                    ship.log(`Cannot find a route to ${toSystem} from ${ship.currentSystemSymbol}.`)
                    return false
                }

                for (const nextSystem of route) {
                    if (nextSystem.edge === 'burn' && ship.navMode !== ShipNavFlightMode.Burn) {
                        await ship.navigateMode(ShipNavFlightMode.Burn)
                    } else if (nextSystem.edge === 'cruise' && ship.navMode !== ShipNavFlightMode.Cruise) {
                        await ship.navigateMode(ShipNavFlightMode.Cruise)
                    } else if (nextSystem.edge === 'drift' && ship.navMode !== ShipNavFlightMode.Drift) {
                        await ship.navigateMode(ShipNavFlightMode.Drift)
                    }

                    if (nextSystem.edge === 'jump') {
                        // make sure we're always at the jump gate if one exists
                        const systemJumpgateWaypoint = await prisma.waypoint.findFirst({
                            where: {
                                systemSymbol: ship.currentSystemSymbol,
                                type: 'JUMP_GATE'
                            }
                        })
                        const targetJumpgateWaypoint = await prisma.waypoint.findFirst({
                            where: {
                                systemSymbol: nextSystem.target,
                                type: 'JUMP_GATE'
                            }
                        })
                        if (systemJumpgateWaypoint && targetJumpgateWaypoint && ship.currentWaypointSymbol !== systemJumpgateWaypoint.symbol) {
                            await ship.navigate(systemJumpgateWaypoint.symbol)
                        }

                        await ship.jump(nextSystem.target)
                        await options?.executeEveryStop?.()
                    } else {
                        const availableWaypoints = await prisma.waypoint.findMany({
                            where: {
                                systemSymbol: nextSystem.target,
                            }
                        })
                        const targetWaypoint = availableWaypoints.find(w => w.symbol === preferredWaypointSymbol)

                        const target = targetWaypoint ? targetWaypoint.symbol : availableWaypoints.length > 0 ? availableWaypoints[0].symbol : undefined
                        if (ship.currentSystemSymbol === nextSystem.target) {
                            ship.log(`Already at system ${nextSystem.target}`)
                        } else if (target) {
                            await ship.warp(target)
                            await options?.executeEveryStop?.()
                        } else {
                            await ship.log(`Cannot warp to system ${nextSystem.target} without waypoints`)
                            throw new Error("Cannot warp to system without waypoints")
                        }
                    }
                }
                // navigate to preferred symbol if not already there
                if (preferredWaypointSymbol && ship.currentWaypointSymbol !== preferredWaypointSymbol) {
                    await ship.navigate(preferredWaypointSymbol)
                }
            } else {
                ship.log(`No need to warp/jump, already at ${toSystem}.`)
                if (preferredWaypointSymbol) {
                    ship.log(`Will navigate to preferred waypoint ${preferredWaypointSymbol}.`)
                    await ship.navigate(preferredWaypointSymbol)
                }
            }
            await ship.setTravelGoal(null)
            return true
        } catch(error) {
            console.log("Unexpected issue in agent, restarting in 60s: ",error?.response?.data ? error?.response?.data : error)
            await ship.waitFor(60000)
        }
    }
}
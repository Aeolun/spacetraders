import {publicProcedure, router} from './trpc';
import z from 'zod'
import {prisma, ShipBehavior} from "@app/prisma";
import {defaultShipStore} from "@app/ship/shipStore";
import {ShipNavFlightMode, ShipType} from "spacetraders-sdk";
import {initAgent} from "@app/agent/init-agent";
import createApi from "@app/lib/createApi";
import {processShip} from "@app/ship/updateShips";
import {storeJumpGateInformation} from "@app/ship/storeResults";
import {createOrGetAgentQueue} from "@app/lib/queue";
import {defaultWayfinder} from "@app/wayfinding";
import {availableLogic} from "@app/ship/behaviors";
import {shipBehaviors, startBehaviorForShip} from "@app/ship/shipBehavior";
import {travelBehavior} from "@app/ship/behaviors/travel-behavior";

export const appRouter = router({
    initUserData: publicProcedure.mutation(async ({input, ctx}) => {
        await initAgent(ctx.token)

        return {
            success: true
        }
    }),
    availableBehaviors: publicProcedure.query(async () => {
        return availableLogic.filter(b => !b.unlisted).map(behavior => {
            return {
                symbol: behavior.symbol,
                name: behavior.name,
                description: behavior.description
            }
        })
    }),
    startBehaviorForShip: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        behavior: z.nativeEnum(ShipBehavior),
        parameters: z.object({
            range: z.number(),
            systemSymbol: z.string()
        })
    })).mutation(async ({input, ctx}) => {
        await prisma.ship.update({
            where: {
                symbol: input.shipSymbol
            },
            data: {
                currentBehavior: input.behavior,
                behaviorRange: input.parameters.range,
                homeSystemSymbol: input.parameters.systemSymbol
            }
        })
        startBehaviorForShip(input.shipSymbol, {
            ...input.parameters,
            once: false,
        }, input.behavior)
    }),
    getRoute: publicProcedure.input(z.object({
        fromSystemSymbol: z.string(),
        toSystemSymbol: z.string(),
        jumpOnly: z.boolean().optional()
    })).query(async ({input}) => {
        if (input.jumpOnly) {
            return defaultWayfinder.findJumpRoute(input.fromSystemSymbol, input.toSystemSymbol, {
                current: 1000,
                max: 1000
            })
        } else {
            return defaultWayfinder.findRoute(input.fromSystemSymbol, input.toSystemSymbol, {
                current: 1000,
                max: 1000
            })
        }
    }),
    cancelBehaviorForShip: publicProcedure.input(z.object({
        shipSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        shipBehaviors[input.shipSymbol]?.cancel()
    }),
    orderTravel: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        systemSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        await startBehaviorForShip(input.shipSymbol, {
            systemSymbol: input.systemSymbol,
            once: true
        }, ShipBehavior.TRAVEL)
    }),
    waypointsForSystem: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol: input.system
            },
            include: {
                traits: true,
                jumpgate: {
                    include: {
                        validJumpTargets: true
                    }
                }
            }
        })

        return waypoints
    }),
    getFactions: publicProcedure.query(async () => {
        return prisma.faction.findMany()
    }),
    shipsForSystem: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        return prisma.ship.findMany({
            where: {
                currentSystemSymbol: input.system,
                agent: {
                    not: 'PHANTASM'
                }
            },
            include: {
                currentWaypoint: true,
                destinationWaypoint: true,
                departureWaypoint: true,
                frame: true,
                reactor: true,
                engine: true,
                mounts: true,
                modules: true
            }
        })
    }),
    updateAgentInfo: publicProcedure.mutation(async ({ctx}) => {
        await initAgent(ctx.token)
        return prisma.agent.findFirst({
            where: {
                symbol: ctx.payload.identifier
            }
        })
    }),
    getAgentInfo: publicProcedure.query(async ({ctx}) => {
        return prisma.agent.findFirst({
            where: {
                symbol: ctx.payload.identifier
            }
        })
    }),
    getMyShips: publicProcedure.query(async ({ctx}) => {
       return prisma.ship.findMany({
           where: {
               agent: ctx.payload.identifier
           },
           include: {
               currentWaypoint: true,
               destinationWaypoint: true,
               departureWaypoint: true,
               frame: true,
               reactor: true,
               engine: true,
               mounts: true,
               modules: true
           }
       })
    }),
    getSystems: publicProcedure.query(async () => {
        return prisma.system.findMany({})
    }),
    instructBuyShip: publicProcedure.input(z.object({
        waypointSymbol: z.string(),
        shipConfigurationSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        console.log(`Purchasing new ${input.shipConfigurationSymbol} at ${input.waypointSymbol}`)
        const api = createApi(ctx.token)
        const newShip = await api.fleet.purchaseShip({
            waypointSymbol: input.waypointSymbol,
            shipType: input.shipConfigurationSymbol as ShipType
        })
        await processShip(newShip.data.data.ship)
    }),
    getShipyard: publicProcedure.input(z.object({
        waypointSymbol: z.string()
    })).query(async ({input}) => {
        return prisma.shipyardModel.findMany({
            where: {
                waypointSymbol: input.waypointSymbol
            },
            include: {
                shipConfiguration: {
                    include: {
                        shipConfigurationMount: true,
                        shipConfigurationModule: true
                    }
                }
            }
        })
    }),
    getMarketInfo: publicProcedure.input(z.object({
        waypoint: z.string()
    })).query(async ({input}) => {
        return prisma.marketPrice.findMany({
            where: {
                waypointSymbol: input.waypoint
            },
            include: {
                tradeGood: true
            }
        })
    }),
    instructNavigate: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        waypointSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.navigate(input.waypointSymbol, false)
    }),
    instructWarp: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        waypointSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.warp(input.waypointSymbol, false)
    }),
    instructJump: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        systemSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.jump(input.systemSymbol, false)
    }),
    instructRefuel: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.refuel()
    }),
    instructPatchNavigate: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        navMode: z.string()
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.navigateMode(input.navMode as ShipNavFlightMode)
    }),
    instructOrbit: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.orbit()
    }),
    instructChart: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.chart()
    }),
    instructDock: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.dock()
    }),
    instructScanWaypoints: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.scanWaypoints()
    }),
    instructScanShips: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.scanShips()
    }),
    instructSellCargo: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.sellAllCargo()
    }),
    instructExtract: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        return ship.extract()
    }),
    instructMarket: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        systemSymbol: z.string(),
        waypointSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        ship.setCurrentLocation(input.systemSymbol, input.waypointSymbol)
        return ship.market()
    }),
    instructJumpGate: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        systemSymbol: z.string(),
        waypointSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        const api = createApi(ctx.token)
        const throttle = createOrGetAgentQueue(ctx.payload.identifier)
        const jumpgateInfo = await throttle( () => api.systems.getJumpGate(input.systemSymbol, input.waypointSymbol))
        await storeJumpGateInformation(input.systemSymbol, input.waypointSymbol, jumpgateInfo.data)
        await defaultWayfinder.loadWaypoints()
        return jumpgateInfo.data
    }),
    instructShipyard: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        systemSymbol: z.string(),
        waypointSymbol: z.string()
    })).mutation(async ({input, ctx}) => {
        const ship = defaultShipStore.constructShipFor(ctx.token, ctx.payload.identifier, input.shipSymbol)
        ship.setCurrentLocation(input.systemSymbol, input.waypointSymbol)
        return ship.shipyard()
    })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
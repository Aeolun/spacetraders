import {publicProcedure, router} from './trpc';
import z from 'zod'
import {prisma} from "@app/prisma";
import {defaultShipStore} from "@app/ship/shipStore";
import {ShipNavFlightMode} from "spacetraders-sdk";
import {initAgent} from "@app/agent/init-agent";

export const appRouter = router({
    initUserData: publicProcedure.mutation(async ({input, ctx}) => {
        await initAgent(ctx.token)

        return {
            success: true
        }
    }),
    waypointsForSystem: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol: input.system
            },
            include: {
                traits: true
            }
        })

        return waypoints
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
        return prisma.system.findMany({
            include: {
                waypoints: {
                    include: {
                        traits: true
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
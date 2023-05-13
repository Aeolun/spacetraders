import {publicProcedure, router} from './trpc';
import z from 'zod'
import {prisma} from "@app/prisma";
import {defaultShipStore} from "@app/ship/shipStore";

export const appRouter = router({
    dataForDisplay: publicProcedure.input(z.object({
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
        const ships = await prisma.ship.findMany({
            where: {
                currentSystemSymbol: input.system
            },
            include: {
                currentWaypoint: true,
                destinationWaypoint: true,
                departureWaypoint: true,
            }
        })

        return {
            waypoints,
            ships
        }
    }),
    getSystems: publicProcedure.query(async () => {
        return prisma.system.findMany()
    }),
    instructNavigate: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        waypointSymbol: z.string()
    })).mutation(async ({input}) => {
        const ship = defaultShipStore.getShip(input.shipSymbol)
        return ship.navigate(input.waypointSymbol, false)
    }),
    instructWarp: publicProcedure.input(z.object({
        shipSymbol: z.string(),
        waypointSymbol: z.string()
    })).mutation(async ({input}) => {
        const ship = defaultShipStore.getShip(input.shipSymbol)
        return ship.warp(input.waypointSymbol, false)
    }),
    instructRefuel: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input}) => {
        const ship = defaultShipStore.getShip(input.shipSymbol)
        return ship.refuel()
    }),
    instructOrbit: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input}) => {
        const ship = defaultShipStore.getShip(input.shipSymbol)
        return ship.orbit()
    }),
    instructDock: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input}) => {
        const ship = defaultShipStore.getShip(input.shipSymbol)
        return ship.dock()
    }),
    instructScanWaypoints: publicProcedure.input(z.object({
        shipSymbol: z.string(),
    })).mutation(async ({input}) => {
        const ship = defaultShipStore.getShip(input.shipSymbol)
        return ship.scanWaypoints()
    })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
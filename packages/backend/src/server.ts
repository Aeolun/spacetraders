import {publicProcedure, router} from './trpc';
import z from 'zod'
import {prisma} from "@app/prisma";

export const appRouter = router({
    dataForDisplay: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol: input.system
            }
        })
        const ships = await prisma.ship.findMany({
            where: {
                currentSystemSymbol: input.system
            },
            include: {
                currentWaypoint: true,
                destinationWaypoint: true
            }
        })

        return {
            waypoints,
            ships
        }
    }),
    getSystems: publicProcedure.query(async () => {
        return prisma.system.findMany()
    })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
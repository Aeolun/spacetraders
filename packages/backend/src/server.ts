import {publicProcedure, router} from './trpc';
import z from 'zod'
import {prisma} from "@app/prisma";

export const appRouter = router({
    dataForDisplay: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        return prisma.waypoint.findMany({
            where: {
                systemSymbol: input.system
            }
        })
    })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
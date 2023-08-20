import { initTRPC } from '@trpc/server';
import {Context} from "./context";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();


/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const isAuthed = t.middleware(({ctx, next}) => {
    if (!ctx.account.accountId) {
        console.log(ctx)
        throw new Error('Unauthorized')
    }
    return next({
        ctx
    });
})

export const authedProcedure = t.procedure.use(isAuthed);
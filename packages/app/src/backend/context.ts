import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import jwtDecode from "jwt-decode";
export async function createContext({
                                        req,
                                        res,
                                    }: trpcNext.CreateNextContextOptions) {
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers
    // This is just an example of something you might want to do in your ctx fn
    async function getUserFromHeader(): Promise<{
        payload: {
            identifier: string
            iat: number
            sub: string
            reset_date: string
            version: 'v2'
        }
        token: string
    } | {}> {
        if (!req.headers.authorization) {
            return {};
        }
        let token = req.headers.authorization.split(' ')[1]
        if (req.headers.authorization) {
            const user: any = await jwtDecode(
                token,
            );
            return {
                payload: {
                    identifier: user.identifier,
                    iat: user.iat,
                    sub: user.sub,
                    reset_date: user.reset_date,
                    version: user.version
                },
                token
            }
        }
        return null;
    }
    return getUserFromHeader();
}
export type Context = inferAsyncReturnType<typeof createContext>;
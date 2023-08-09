import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import jwtDecode from "jwt-decode";
import {prisma} from "@backend/prisma";
export async function createContext({
                                        req,
                                        res,
                                    }: trpcNext.CreateNextContextOptions) {
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers
    // This is just an example of something you might want to do in your ctx fn
    async function getUserFromHeader(): Promise<{
        account?: {
            email: string
        }
        payload?: {
            identifier: string
            iat: number
            sub: string
            reset_date: string
            version: 'v2'
        }
        token?: string
    }> {
        if (!req.headers.authorization) {
            return {};
        }
        let token = req.headers.authorization.split(' ')[1]
        if (req.headers.authorization) {
            const userToken: {
                email: string
                server: string
            } = await jwtDecode(
                token,
            );
            const server = await prisma.server.findFirstOrThrow({
                where: {
                    name: userToken.server
                }
            })
            const agent = await prisma.agent.findFirst({
                where: {
                    Account: {
                        email: userToken.email
                    },
                    server: userToken.server,
                    reset: server.resetDate
                }
            })
            const agentToken: any = jwtDecode(agent.token)

            return {
                account: {
                    email: userToken.email
                },
                payload: {
                    identifier: agentToken.identifier,
                    iat: agentToken.iat,
                    sub: agentToken.sub,
                    reset_date: agentToken.reset_date,
                    version: agentToken.version
                },
                token: agent.token
            }
        }
        return null;
    }
    return getUserFromHeader();
}
export type Context = inferAsyncReturnType<typeof createContext>;
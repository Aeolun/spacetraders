import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import jwtDecode from "jwt-decode";
import {prisma} from "@common/prisma";
export async function createContext({
                                        req,
                                        res,
                                    }: trpcNext.CreateNextContextOptions) {
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers
    // This is just an example of something you might want to do in your ctx fn
    async function getUserFromHeader(): Promise<{
        account?: {
            accountId: string
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
        if (token) {
            // const userToken: {
            //     accountId: string
            //     email: string
            //     server?: string
            // } = await jwtDecode(
            //     token,
            // );
            // console.log('token', userToken)

            // let agentTokenPayload: any | undefined, agentToken: string | undefined;
            // if (userToken.server) {
            //     const server = await prisma.server.findFirstOrThrow({
            //         where: {
            //             apiUrl: process.env.API_ENDPOINT
            //         }
            //     })
            //     const agent = await prisma.agent.findFirst({
            //         where: {
            //             Account: {
            //                 id: userToken.accountId
            //             },
            //
            //             reset: server.resetDate
            //         }
            //     })
            //     agentToken = agent.token
                const agentTokenPayload: any = jwtDecode(token)
            // }

            return {
                // account: {
                //     accountId: userToken.accountId,
                //     email: userToken.email
                // },
                payload: agentTokenPayload ? {
                    identifier: agentTokenPayload.identifier,
                    iat: agentTokenPayload.iat,
                    sub: agentTokenPayload.sub,
                    reset_date: agentTokenPayload.reset_date,
                    version: agentTokenPayload.version
                } : undefined,
                token: token
            }
        }
        return null;
    }
    return getUserFromHeader();
}
export type Context = inferAsyncReturnType<typeof createContext>;
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
import {createTRPCProxyClient, httpBatchLink, createWSClient, wsLink, splitLink} from "@trpc/client";
import { createTRPCReact } from '@trpc/react-query';
import type {AppRouter} from "@backend/server";

export const backendUrl='http://'+window.location.hostname;
//const backendUrl='http://coder.us1.serial-experiments.com'

// @ts-ignore replaced by vite
export const port: number = __API_PORT__

const wsClient = createWSClient({
    // * put ws instead of http on the url
    url: backendUrl.replace('https', 'wss').replace('http', 'ws')+`:${port+1}/trpc`,
    retryDelayMs: (attempt) => {
        if (attempt > 10) {
            return null
        } else {
            return 1000
        }
    }
})

export const trpc = createTRPCProxyClient<AppRouter>({
    transformer: null,
    links: [
        splitLink({
            // * only use the web socket link if the operation is a subscription
            condition: (operation) => {
                return operation.type === 'subscription'
            },

            true: wsLink({
                client: wsClient, // * <- use the web socket client
            }),

            // * use the httpBatchLink for everything else (query, mutation)
            false: httpBatchLink({
                url: backendUrl+`:${port}`,
                async headers() {
                    const token = localStorage.getItem('agent-token') ?? localStorage.getItem('user-token')
                    return token ? {
                        authorization: 'Bearer '+token,
                    } : {};
                },
            }),
        }),
    ],
});

export const trpcReact = createTRPCReact<AppRouter>();

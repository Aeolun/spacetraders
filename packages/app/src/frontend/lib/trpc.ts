// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
import {createTRPCProxyClient, httpBatchLink} from "@trpc/client";
import type {AppRouter} from "@app/server";

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://'+window.location.hostname+':4001',
            async headers() {
                return {
                    authorization: 'Bearer '+localStorage.getItem('agent-token'),
                };
            },
        }),
    ],
});

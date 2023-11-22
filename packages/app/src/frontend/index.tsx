import {Provider, useSelector} from "react-redux";
import {RootState, store} from "@front/ui/store";
import {createRoot} from "react-dom/client";
import {Pixi} from "@front/components/Pixi";
import * as appStyles from "@front/styles/app.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {SelectionDisplay} from "@front/components/SelectionDisplay";
import {backendUrl, trpcReact} from "./trpc";
import {httpBatchLink} from "@trpc/client";
import {useState} from "react";
import {format} from "@common/lib/format";
import {
    createBrowserRouter, Link,
    RouterProvider,
} from "react-router-dom";
import {World} from "@front/components/World";
import {Layout} from "@front/components/Layout";
import { NotFound } from "./components/NotFound";

if (!localStorage.getItem('agent-token')) {
    const agentToken = prompt('Please enter your agent token')
    localStorage.setItem('agent-token', agentToken)
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <Layout><NotFound /></Layout>,
        children: [
            {
                children: [
                    {
                        index: true,
                        element: <World />
                    },
                ]
            }
        ]
    },
]);

const App = () => {
    const [trpcClient] = useState(() => trpcReact.createClient({
        links: [
            httpBatchLink({
                url: backendUrl+':4001',
                // You can pass any HTTP headers you wish here
                async headers() {
                    const token = localStorage.getItem('agent-token') ?? localStorage.getItem('user-token')
                    return token ? {
                        authorization: 'Bearer '+token,
                    } : {};
                },
            }),
        ],
    }),);

    return <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider></trpcReact.Provider>
}

const root = createRoot(document.getElementById('app'))
root.render(<Provider store={store}><App /></Provider>)
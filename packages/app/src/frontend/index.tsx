import {Provider} from "react-redux";
import {store} from "@front/ui/store";
import {createRoot} from "react-dom/client";
import {Pixi} from "@front/components/Pixi";
import * as appStyles from "@front/styles/app.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {SelectionDisplay} from "@front/components/SelectionDisplay";
import {backendUrl, trpcReact} from "./trpc";
import {httpBatchLink} from "@trpc/client";
import {useState} from "react";

if (!localStorage.getItem('agent-token')) {
    const agentToken = prompt('Please enter your agent token')
    localStorage.setItem('agent-token', agentToken)
}

const queryClient = new QueryClient()

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

    return <trpcReact.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><div className={appStyles.app}>

        <div className={appStyles.menu}>
            <div className={appStyles.menuItem}>Main</div>
            <div className={appStyles.menuItem}>Ships</div>
            <div className={appStyles.menuItem}>Waypoints</div>
            <div className={appStyles.menuItem}>Systems</div>
        </div>
        <section className={appStyles.columns}>
            <div className={appStyles.column}>
                <h3>Options</h3>
            </div>
            <Pixi />
            <div className={appStyles.column}>
                <h3>Details</h3>
                <SelectionDisplay />
            </div>
        </section>
        </div></QueryClientProvider></trpcReact.Provider>
}

const root = createRoot(document.getElementById('app'))
root.render(<Provider store={store}><App /></Provider>)
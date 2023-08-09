import {appRouter} from '@app/server'
import {createHTTPServer} from '@trpc/server/adapters/standalone';
import cors from 'cors'

import {config} from 'dotenv'

import axios from "axios";
import {resetDatabase} from "@app/setup/reset-database";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {reloadWorldStatus} from "@app/setup/reload-world-status";
import {loadWaypoint, updateMarketPrices} from "@app/init";
import {createContext} from "@app/context";
import {prisma, ShipBehavior} from "@app/prisma";
import fs from "fs";
import {initializeShipBehaviors} from "@app/ship/initializeShipBehaviors";
import {initAgent} from "@app/agent/init-agent";
import {applyWSSHandler} from "@trpc/server/adapters/ws";
import ws from 'ws'
import {scheduleLeaderboardUpdate, updateLeaderboard} from "@app/leaderboard";
import {backgroundQueue} from "@app/lib/queue";
import {initGlobalBehavior} from "@app/strategy/global-behavior";


export type { AppRouter } from '@app/server'

config();

interface StatusResponse {
    status: string
    version: string
    resetDate: string
    serverResets: {
        next: string
    }
}

let currentInstance: string

const init = async () => {
    // do we have a database connection?
    const resetDate = await prisma.$queryRaw<{ resetDate: string }[]>`SELECT resetDate from Server`

    if (resetDate.length > 0 && resetDate[0].resetDate) {
        currentInstance = resetDate[0].resetDate
    }

    const serverStatus = await axios.get<StatusResponse>(process.env.API_ENDPOINT)

    const initWorld = async (resetDate: string) => {
        console.log("Resetting database")
        await resetDatabase()
        console.log("Getting (new) token")
        const newToken = await getBackgroundAgentToken(serverStatus.data.resetDate);
        console.log("Have token!", newToken)
        console.log("Reloading world from API")
        await reloadWorldStatus()
        console.log("Reset completed")
        await prisma.server.create({
            data: {
                resetDate
            }
        })

        await initAgent(newToken);
        loadWaypoint().then(() => {
            console.log('Waypoint load complete')
        })

        return newToken
    }

    let resetYetInterval;
    const resetTimeout = () => {
        resetYetInterval = setInterval(async () => {
            const serverStatus = await backgroundQueue(() => axios.get<StatusResponse>(process.env.API_ENDPOINT))

            if (serverStatus.data.resetDate !== currentInstance) {
                // yay! reset completed
                console.log("Reset completed! Restarting client.")
                // need to exit with non zero code so concurrently will restart
                process.exit(1);
            }
        }, 5000)
    }

    let agentToken;
    console.log('Current data reset date: ', currentInstance)
    console.log('API reset date', serverStatus.data.resetDate)
    const timeUntilReset = new Date(serverStatus.data.serverResets.next).getTime() - Date.now()
    if (serverStatus.data.resetDate === currentInstance) {
        console.log(`Waiting ${timeUntilReset - 3600 * 1000} milliseconds, until 1 hour before reset time to begin polling`)
        agentToken = await getBackgroundAgentToken(serverStatus.data.resetDate)
        await initAgent(agentToken);

        loadWaypoint().then(() => {
            console.log('Waypoint load complete')
        })
        // start checking for reset one hour before indicated
    } else {
        console.log("Server already reset or never initialized.")
        agentToken = await initWorld(serverStatus.data.resetDate)
    }

    setTimeout(resetTimeout, Math.max(timeUntilReset - 3600 * 1000, 0))
    await initializeShipBehaviors()
    await initGlobalBehavior()
    
    scheduleLeaderboardUpdate()
}

const httpServer = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext: createContext
})


const wss = new ws.Server({
    port: 4002,
});
applyWSSHandler({ wss, router: appRouter, createContext })
wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
    });
});

httpServer.listen(4001)
console.log("✅ Listening at port 4001")
console.log('✅ WebSocket Server listening on ws://localhost:4002');
init().catch(error => {
    console.error("Issue during initialization, server probably broken", error)
    process.exit(1)
})

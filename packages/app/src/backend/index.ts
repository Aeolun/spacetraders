import {appRouter} from '@app/server'
import {createHTTPServer} from '@trpc/server/adapters/standalone';
import cors from 'cors'

import {config} from 'dotenv'

import axios from "axios";
import {resetDatabase} from "@app/setup/reset-database";
import {deleteBackgroundAgentToken, getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {reloadWorldStatus} from "@app/setup/reload-world-status";
import {loadWaypoint, updateMarketPrices} from "@app/init";
import {createContext} from "@app/context";
import {prisma, ShipBehavior} from "@app/prisma";

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
    await prisma.$queryRaw`SELECT 1`

    const serverStatus = await axios.get<StatusResponse>('https://api.spacetraders.io/v2')
    currentInstance = serverStatus.data.resetDate
    const timeUntilReset = new Date(serverStatus.data.serverResets.next).getTime() - Date.now()

    const initWorld = async (resetDate: string) => {
        console.log("Resetting database")
        await resetDatabase()
        console.log("Getting (new) token")
        const newToken = await getBackgroundAgentToken();
        console.log("Have token!", newToken)
        console.log("Reloading world from API")
        await reloadWorldStatus()
        console.log("Reset completed")
        await prisma.server.create({
            data: {
                resetDate
            }
        })
    }

    console.log(`Waiting ${timeUntilReset - 3600 * 1000} milliseconds, until 1 hour before reset time to begin polling`)
    let resetYetInterval;

    const resetTimeout = () => {
        resetYetInterval = setInterval(async () => {
            const serverStatus = await axios.get<StatusResponse>('https://api.spacetraders.io/v2')

            if (serverStatus.data.resetDate !== currentInstance) {
                // yay! reset completed
                console.log("Deleting previous token")
                await deleteBackgroundAgentToken()

                await initWorld(serverStatus.data.resetDate)

                loadWaypoint().then(() => {
                    console.log('Waypoint load complete')
                })

                clearInterval(resetYetInterval)
                const timeUntilReset = new Date(serverStatus.data.serverResets.next).getTime() - Date.now()
                setTimeout(resetTimeout, timeUntilReset - 3600 * 1000)
            }
        }, 5000)
    }
    setTimeout(resetTimeout, timeUntilReset - 3600 * 1000)

    const server = await prisma.server.findFirst({})
    if (!server) {
        console.log("Server has not been initialized in this database.")
        await initWorld(serverStatus.data.resetDate)
    }

    // await updateMarketPrices()
    loadWaypoint().then(() => {
        console.log('Waypoint load complete')
    }).catch(error => {
        console.error(error)
    })
    // updateMarketPrices().then(() => {
    //     console.log("market prices updated")
    // })
}

const httpServer = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext: createContext
})


httpServer.listen(4001)
init().catch(error => {
    console.error("Issue during initialization, server probably broken", error)
    process.exit(1)
})
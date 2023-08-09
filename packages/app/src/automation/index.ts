import {config} from 'dotenv'

import axios from "axios";
import {resetDatabase} from "@auto/setup/reset-database";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {reloadWorldStatus} from "@auto/setup/reload-world-status";
import {loadWaypoint, updateMarketPrices} from "@auto/init";

import {prisma, ShipBehavior} from "@auto/prisma";
import {initializeShipBehaviors} from "@auto/ship/initializeShipBehaviors";
import {initAgent} from "@auto/agent/init-agent";
import {scheduleLeaderboardUpdate, updateLeaderboard} from "@auto/leaderboard";
import {backgroundQueue} from "@auto/lib/queue";
import {initGlobalBehavior} from "@auto/strategy/global-behavior";

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

if (!process.env.API_ENDPOINT) {
    throw new Error("API_ENDPOINT not set")
} else {
    console.log("Using API endpoint", process.env.API_ENDPOINT)
}

const init = async () => {
    // do we have a database connection?
    const resetDate = await prisma.$queryRaw<{ resetDate: string }[]>`SELECT resetDate from Server where endpoint=${process.env.API_ENDPOINT}`

    if (resetDate.length > 0 && resetDate[0].resetDate) {
        currentInstance = resetDate[0].resetDate
    } else {
        throw new Error("Endpoint not defined in database, please add Servers you want to be able to connect to to the database.")
    }

    const serverStatus = await axios.get<StatusResponse>(process.env.API_ENDPOINT)

    const initWorld = async (resetDate: string) => {
        console.log("Resetting database")
        await resetDatabase()
        console.log("Reloading world from API")
        await reloadWorldStatus()
        console.log("Getting (new) token")
        const newToken = await getBackgroundAgentToken(serverStatus.data.resetDate);
        console.log("Have token!", newToken)


        console.log("Reset completed")
        await prisma.server.update({
            where: {
                endpoint: process.env.API_ENDPOINT
            },
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

init().catch(error => {
    console.error("Issue during initialization, server probably broken", error)
    process.exit(1)
})

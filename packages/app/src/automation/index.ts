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

if (!process.env.ACCOUNT_EMAIL) {
    throw new Error("ACCOUNT_EMAIL not set")
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
    if (serverStatus.data.resetDate !== currentInstance) {
        throw new Error("Server reset date does not match database, please update database or reset server.")
    }


    let resetYetInterval;

    await initializeShipBehaviors()
    await initGlobalBehavior()
    
    scheduleLeaderboardUpdate()
}

init().catch(error => {
    console.error("Issue during initialization, server probably broken", error)
    process.exit(1)
})

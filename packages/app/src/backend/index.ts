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
import {tradeLogic} from "@app/ship/behaviors/trade-behavior";
import {exploreBehavior} from "@app/ship/behaviors/explore-behavior";
import {updateMarketsBehavior} from "@app/ship/behaviors/update-markets-behavior";
import {mineBehavior} from "@app/ship/behaviors/mine-behavior";
import {seedFactions} from "@app/seed/seedGameData";
import {exploreNewMarkets} from "@app/ship/behaviors/explore-markets-shipyards";
import createApi from "@app/lib/createApi";
import {processShip} from "@app/ship/updateShips";
import {backgroundQueue} from "@app/lib/queue";
import {travelBehavior} from "@app/ship/behaviors/travel-behavior";

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
prisma.ship.findMany({
    where: {
        NOT: {
            currentBehavior: null
        }
    }
}).then(ships => {
    ships.forEach(ship => {
        // start behavior
        switch(ship.currentBehavior) {
            case ShipBehavior.TRADE:
                tradeLogic(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                break;
            case ShipBehavior.MINE:
                mineBehavior(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                break;
            case ShipBehavior.EXPLORE:
                exploreBehavior(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                break;
            case ShipBehavior.UPDATE_MARKETS:
                updateMarketsBehavior(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                break;
            case ShipBehavior.EXPLORE_MARKETS:
                exploreNewMarkets(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
        }
    })
})

// setInterval(async () => {
//     console.log("Should purchase new ships?")
//     const shipNr = await prisma.ship.findMany({
//         where: {
//             agent: 'PHANTASM',
//             role: 'HAULER'
//         }
//     })
//
//     const agent = await prisma.agent.findFirstOrThrow({
//         where: {
//             symbol: 'PHANTASM'
//         }
//     })
//     if (agent.credits > shipNr.length * 250_000) {
//         const token = await getBackgroundAgentToken()
//         const api = createApi(token)
//
//         // new hauler
//         const newHauler = await backgroundQueue(() => api.fleet.purchaseShip({
//             waypointSymbol: 'X1-GZ3-93937B',
//             shipType: 'SHIP_LIGHT_HAULER'
//         }))
//         await processShip(newHauler.data.data.ship)
//
//         await prisma.ship.update({
//             where: {
//                 symbol: newHauler.data.data.ship.symbol
//             },
//             data: {
//                 currentBehavior: ShipBehavior.TRADE,
//                 homeSystemSymbol: 'X1-GZ3',
//                 behaviorRange: 20000
//             }
//         })
//         tradeLogic(newHauler.data.data.ship.symbol, 'X1-GZ3', 20000)
//
//         // new probes
//         for(let i = 0; i < 2; i++) {
//             const newProbe = await backgroundQueue(() => api.fleet.purchaseShip({
//                 waypointSymbol: 'X1-GZ3-93937B',
//                 shipType: 'SHIP_PROBE'
//             }))
//             await processShip(newProbe.data.data.ship)
//
//             await prisma.ship.update({
//                 where: {
//                     symbol: newProbe.data.data.ship.symbol
//                 },
//                 data: {
//                     currentBehavior: ShipBehavior.UPDATE_MARKETS,
//                     homeSystemSymbol: 'X1-GZ3',
//                     behaviorRange: 20000
//                 }
//             })
//             updateMarketsBehavior(newProbe.data.data.ship.symbol, 'X1-GZ3', 20000)
//         }
//     }
//
// }, 300000)

import {Ship} from "@app/ship/ship";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";
import {logShipAction} from "@app/lib/log";
export type { AppRouter } from '@app/server'
import { appRouter } from '@app/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors'
import api from '@app/lib/apis'

import { config } from 'dotenv'
import fs from "fs";
import { generateName } from "@app/lib/generate-name";
import {processAgent, updateShips} from "@app/ship/updateShips";
import {prisma} from "@app/prisma";
import {defaultShipStore, ShipStore} from "@app/ship/shipStore";
import axios from "axios";
import {agentToken} from "@app/configuration";
import {seedGameData} from "@app/seed/seedGameData";
import {storeWaypointScan} from "@app/ship/storeResults";
import {throttle} from "@app/lib/queue";

config();


const newServerStartup = async () => {
    try {
        let agentToken
        if (!fs.existsSync('.agent-token') || fs.readFileSync('.agent-token').toString().trim() == '') {
            const result = await api.default.register({
                symbol: "PHANTASM",
                email: "bart@serial-experiments.com",
                faction: "GALACTIC"
            })
            fs.writeFileSync('registrationResult.json', JSON.stringify(result.data, null, 2))
            fs.writeFileSync('.agent-token', result.data.data.token)
            agentToken = result.data.data.token
        } else {
            agentToken = fs.readFileSync('.agent-token').toString().trim()
        }

        await seedGameData(agentToken)

        const allSystems = await prisma.system.findMany({})
        await Promise.all(allSystems.map(async (s) => {
            await prisma.system.update({
                data: {
                    name: generateName()
                },
                where: {
                    symbol: s.symbol
                }
            })
        }))
        console.log("Generated readable names for all systems")

        console.log("System booted. Remove code and restart client.")
        process.exit()


    } catch(error) {
        console.error(error.response.data)
    }
}

const init = async () => {
    // await newServerStartup()

    const marketprices = await axios.get('https://st.feba66.de/prices')
    //const marketprices = { data: JSON.parse(fs.readFileSync('./markets.json').toString()) }

    const finalPrices = {},
        waypoints = {},
        symbols = {}
    marketprices.data.forEach(row => {
        finalPrices[row.waypointSymbol+row.symbol] = row
        waypoints[row.waypointSymbol] = true
        symbols[row.symbol] = true
    })
    console.log({
        waypoints: Object.keys(waypoints).length,
        symbols: Object.keys(symbols).length
    })
    console.log("inserting ", Object.values(finalPrices).length, 'items')
    for (const item of Object.values(finalPrices)) {
        await prisma.tradeGood.upsert({
            where: {
                symbol: item.symbol
            },
            create: {
                symbol: item.symbol,
                name: item.symbol,
                description: item.symbol,
            },
            update: {}
        })
        await prisma.marketPrice.upsert({
            where: {
                waypointSymbol_tradeGoodSymbol: {
                    waypointSymbol: item.waypointSymbol,
                    tradeGoodSymbol: item.symbol,
                }
            },
            update: {
                supply: item.supply,
                purchasePrice: item.purchasePrice,
                sellPrice: item.sellPrice,
                tradeVolume: item.tradeVolume,
                updatedOn: item.timestamp
            },
            create: {
                waypointSymbol: item.waypointSymbol,
                tradeGoodSymbol: item.symbol,
                supply: item.supply,
                purchasePrice: item.purchasePrice,
                sellPrice: item.sellPrice,
                tradeVolume: item.tradeVolume,
                updatedOn: item.timestamp
            }
        })
        console.log(item.waypointSymbol, item.symbol)
    }

    const res = await api.agents.getMyAgent()
    await processAgent(res.data.data)

    try {
        await updateShips()
        const allShips = await prisma.ship.findMany({
            where: {
                agent: 'PHANTASM'
            }
        })
        allShips.forEach(ship => {
            defaultShipStore.addShip(ship.symbol)
        })
        console.log("All ships updated")
    } catch(error) {
        console.log(error?.response?.data ? JSON.stringify(error.response.data, null, 2) : error.toString())
        throw error
    }

    const waypoint = await api.systems.getWaypoint('X1-XK71', 'X1-XK71-02954F')
    fs.writeFileSync('specialwaypoint', JSON.stringify(waypoint.data.data, null, 2))

    const systems = await prisma.system.findMany({
        where: {
            waypointsRetrieved: false
        }
    })
    let i = 0;
    for(const system of systems) {
        await throttle(async () => {
            i++

            const allWaypoints = await api.systems.getSystemWaypoints(system.symbol, 1, 20)
            console.log(`${i}/${systems.length}: got all waypoints for ${system.name} (${system.symbol})`)
            await storeWaypointScan(system.symbol, allWaypoints.data)
        })
    }

    // const jumpData = await api.systems.getJumpGate('X1-VU95', 'X1-VU95-02039Z')
    // fs.writeFileSync('jump.json', JSON.stringify(jumpData.data.data))

    // const navigate = await fleet.navigateShip('PHANTASM-1', {
    //     waypointSymbol: "X1-VU95-02777Z"
    // })
    // console.log(navigate.data.data)

    //await waypointScanAndRecord("PHANTASM-1")

    // const newShip = await api.fleet.purchaseShip({
    //     shipType: "SHIP_ORE_HOUND",
    //     waypointSymbol: "X1-VU95-02777Z"
    // })
    // fs.writeFileSync(`./newship${newShip.data.data.ship.symbol}.json`, JSON.stringify(newShip.data.data, null, 2))
}

const mineLogic = async (shipReg: string) => {
    const ship = new Ship(shipReg)
    let started = false

    while(true) {
        try {
            if (!started) {
                await ship.validateCooldowns()
                await ship.navigate('X1-VU95-76575B')
                started = true
            }

            let extractResult: ExtractResources201Response | undefined;
            let diamondSurvey: Survey | undefined = undefined
            do {
                await ship.orbit()
                if (!diamondSurvey && shipReg !== 'PHANTASM-2') {
                    const survey = await ship.survey();
                    diamondSurvey = survey.data.data.surveys.find(sur => {
                        const goodOnes = sur.deposits.filter(d => d.symbol === 'DIAMONDS' || d.symbol === 'GOLD_ORE' || d.symbol === 'PLATINUM_ORE' || d.symbol === 'SILVER_ORE' || d.symbol === 'ALUMINUM_ORE').length
                        logShipAction(ship.symbol, `Decent deposit count: ${goodOnes}`)
                        return goodOnes >= 2
                    })
                    if (diamondSurvey) {
                        logShipAction(ship.symbol, `Found worthwhile survey with id: ${diamondSurvey.signature}`)
                    }
                }

                extractResult = (await ship.extract(diamondSurvey))
                await ship.dock()
                await ship.sellAllCargo()

            } while (extractResult && extractResult.data.cargo.units < extractResult.data.cargo.capacity)

            // for (const market of ['X1-VU95-44008F', 'X1-VU95-02777Z', 'X1-VU95-76575B', 'X1-VU95-12753B', 'X1-VU95-79922E', 'X1-VU95-25701D', 'X1-VU95-90460B']) {
            //     await ship.orbit()
            //     await ship.navigate(market)
            //     await ship.dock()
            //     await ship.market()
            //     await ship.currentCargo()
            //     await ship.refuel()
            // }
            // break;
        } catch(error) {
            console.log("Unexpected issue in agent, restarting: ",error?.response?.data ? error?.response?.data : error.toString())
            started = false
        }
    }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}
const httpServer = createHTTPServer({
    router: appRouter,
    middleware: cors(),

})
httpServer.listen(4001)
init()
// doStuff('PHANTASM-1')
// doStuff('PHANTASM-2')
// doStuff('PHANTASM-3')
// doStuff('PHANTASM-4')
// doStuff('PHANTASM-5')
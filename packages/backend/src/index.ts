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
import {updateShips} from "@app/ship/updateShips";
import {prisma} from "@app/prisma";

config();

const init = async () => {
    // try {
    //     const result = await def.register({
    //         symbol: "PHANTASM",
    //         faction: "GALACTIC"
    //     })
    //     fs.writeFileSync('registrationResult.json', JSON.stringify(result.data))
    // } catch(error) {
    //     console.error(error.response.data)
    // }
    try {
        await updateShips()
    } catch(error) {
        console.log(error?.response?.data ? JSON.stringify(error.response.data, null, 2) : error.toString())
        throw error
    }

    const jumpData = await api.systems.getJumpGate('X1-VU95', 'X1-VU95-02039Z')
    fs.writeFileSync('jump.json', JSON.stringify(jumpData.data.data))

    // const allSystems = await prisma.system.findMany({})
    // await Promise.all(allSystems.map(async (s) => {
    //     await prisma.system.update({
    //         data: {
    //             name: generateName()
    //         },
    //         where: {
    //             symbol: s.symbol
    //         }
    //     })
    // }))
    // console.log("Generated names for all systems")
    // await seedSystems()

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

const doStuff = async (shipReg: string) => {
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
doStuff('PHANTASM-1')
doStuff('PHANTASM-2')
doStuff('PHANTASM-3')
doStuff('PHANTASM-4')
doStuff('PHANTASM-5')
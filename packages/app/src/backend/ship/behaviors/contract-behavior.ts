import {Ship} from "@app/ship/ship";
import {ExtractResources201Response, Market, MarketTradeGood, MarketTransaction, Survey} from "spacetraders-sdk";
import {logShipAction} from "@app/lib/log";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {prisma} from "@app/prisma";
import {travelBehavior} from "@app/ship/behaviors/travel-behavior";
import {getDistance} from "@common/lib/getDistance";
import {defaultWayfinder} from "@app/wayfinding";
import {findTradesBetweenSystems} from "@app/findTradesBetweenSystems";
import {availableActions} from "@front/lib/availableActions";
import {symbol} from "zod";
import {getFuelCost} from "@common/lib/getFuelCost";
import {generateLogsFromBuyAndSell} from "@app/lib/generateLogsFromBuyAndSell";

interface TradeLocation {
    system: string
    waypoint: string,
    jumpGate?: string
}




const tradeTaken = new Set([] as string[])
export const tradeLogic = async (shipReg: string, fromSystem: string, range: number) => {
    const token = await getBackgroundAgentToken()
    const ship = new Ship(token, 'PHANTASM', shipReg)

    let started = false

    while(true) {
        try {
            if (!started) {
                await ship.validateCooldowns()
                await ship.updateShipStatus()

                started = true
            }

            const currentSystem = await prisma.system.findFirstOrThrow({
                where: {
                    symbol: ship.currentSystemSymbol
                }
            })

            const currentMoneyResult = await ship.api.agents.getMyAgent()
            let currentMoney = currentMoneyResult.data.data.credits
            const cargo = await ship.currentCargo()
            const cargoCapacity = cargo.cargoCapacity
            const cargoValue = cargo.cargoCapacity - cargo.cargoUsed

            const contract = ship.contract()
        } catch(error) {
            console.log("Unexpected issue in agent, restarting in 60s: ",error?.response?.data ? error?.response?.data : error)
            await ship.waitFor(60000)

            started = false
        }
    }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}
import {Ship} from "@app/ship/ship";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";
import {logShipAction} from "@app/lib/log";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";

interface TradeLocation {
    system: string
    waypoint: string,
    jumpGate?: string
}

export const tradeLogic = async (shipReg: string, from: TradeLocation, to: TradeLocation, good: string) => {
    const token = await getBackgroundAgentToken()
    const ship = new Ship(token, 'PHANTASM', shipReg)
    let started = false

    const travelToLocation = async (targetLocation: TradeLocation) => {
        const jumpGate = from.system === ship.currentSystemSymbol ? from.jumpGate : to.jumpGate

        if (ship.currentSystemSymbol !== targetLocation.system && jumpGate) {
            await ship.navigate(jumpGate)
            await ship.jump(targetLocation.system)
            await ship.navigate(targetLocation.waypoint)
        } else if (ship.currentSystemSymbol !== targetLocation.system) {
            await ship.warp(from.waypoint)
        } else if (ship.currentWaypointSymbol !== targetLocation.waypoint) {
            await ship.navigate(from.waypoint)
        }
    }

    // while(true) {
        try {
            if (!started) {
                await ship.validateCooldowns()
                await ship.updateLocation()

                started = true
            }


            const currentMoney = await ship.api.agents.getMyAgent()

            // await travelToLocation(from)
            // await ship.dock()
            // const marketInfo = await ship.market()
            // const cargo = await ship.currentCargo()
            // const thingToBuy = marketInfo.tradeGoods.find(i => i.symbol == good)
            //
            // const maxPurchaseAmount = Math.min(cargo.cargoCapacity - cargo.cargoUsed, thingToBuy.tradeVolume, Math.floor(currentMoney.data.data.credits / thingToBuy.purchasePrice))
            // console.log("Maximum to buy is " + maxPurchaseAmount)
            // await ship.purchaseCargo(good, maxPurchaseAmount)
            // const marketInfoAfter = await ship.market()
            //
            // const thingBought = marketInfoAfter.tradeGoods.find(i => i.symbol == good)
            // console.log(`Price changed from ${thingToBuy.purchasePrice} -> ${thingBought.purchasePrice}`)

            // await travelToLocation(to)
            // await ship.dock()
            await ship.sellAllCargo()
            const soldMarket = await ship.market()
            const thingSold = soldMarket.tradeGoods.find(i => i.symbol == good)
            console.log(`Sell price of item is now ${thingSold.sellPrice}`)

        } catch(error) {
            console.log("Unexpected issue in agent, restarting: ",error?.response?.data ? error?.response?.data : error.toString())
            started = false
        }
    // }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}
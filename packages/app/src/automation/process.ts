import fs from "fs";
import { join } from 'path';
import {Ship} from "@auto/ship/ship";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {processShipyard} from "@common/lib/data-update/store-shipyard";

const targetPrice = 7668
const good = 'MODULE_CARGO_HOLD_I'

const process = async () => {
    const backgroundToken = await getBackgroundAgentToken()





    //const marketBefore = transportShip.market()
    //await transportShip.purchaseCargo('PLASTICS', 1000)

    purchaserBehavior(backgroundToken);
    //traderBehavior(backgroundToken);
}
const traderBehavior = async (backgroundToken: string) => {
    const transportShip = new Ship(backgroundToken, 'PHANTASM', 'PHANTASM-44')
    await transportShip.updateShipStatus()


    // while(true) {
    //     const marketBefore = await transportShip.market()
    //     await transportShip.dock();
    //     await transportShip.purchaseCargo(good, 10)
    //     await transportShip.navigate('X1-GZ3-35169E')
    //     await transportShip.jump('X1-ZT10')
    //     await transportShip.navigate('X1-ZT10-06013X')
    //     await transportShip.dock()
    //     await transportShip.sellCargo(good, 10)
    //     await transportShip.navigate('X1-ZT10-58014X')
    //     await transportShip.jump('X1-GZ3')
    //     await transportShip.navigate('X1-GZ3-93937B')
    //
    //     //const goodBefore = marketBefore.tradeGoods.find(i => i.symbol === good)
    // }
}

const purchaserBehavior = async (backgroundToken: string) => {
    const priceShip = new Ship(backgroundToken, 'PHANTASM', 'PHANTASM-2')
    await priceShip.updateShipStatus()
    await priceShip.dock();
    await priceShip.contract()
    // while(true) {
    //     const marketBefore = await priceShip.market()
    //
    //     const goodBefore = marketBefore.tradeGoods.find(i => i.symbol === good)
    //     //if (goodBefore.sellPrice < targetPrice) {
    //         await priceShip.sellCargo(good, 10)
    //         //await priceShip.yeet(good, 10)
    //         const marketAfter = await priceShip.market()
    //         const goodAfter = marketAfter.tradeGoods.find(i => i.symbol === good)
    //
    //         if (goodBefore.purchasePrice < goodAfter.purchasePrice) {
    //             console.log(`Price increased to ${goodAfter.purchasePrice}`)
    //         }
    //
    //         fs.writeFileSync('./markets.json', JSON.stringify({
    //             goodBefore,
    //             goodAfter
    //         }))
    //     // } else {
    //     //     console.log(`Sell price still at ${goodBefore.sellPrice}, ${goodBefore.sellPrice - targetPrice} above target price.`)
    //     // }
    //
    //     await priceShip.waitFor(5000)
    // }
}

process()
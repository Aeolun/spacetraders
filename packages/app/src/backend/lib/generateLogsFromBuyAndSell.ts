import {MarketTransaction} from "spacetraders-sdk";
import {prisma, Prisma} from "@app/prisma";

export function generateLogsFromBuyAndSell(shipSymbol: string, buyTransactions: MarketTransaction[], sellTransactions: MarketTransaction[]) {
    const logs: Prisma.TradeLogCreateInput[]

    let sellTransactionPointer = 0;
    buyTransactions.forEach(purchase => {
        const correspondingTransactions: MarketTransaction[] = []
        let totalSellUnits = 0
        while (purchase.units > totalSellUnits) {
            totalSellUnits += sellTransactions[sellTransactionPointer].units
            correspondingTransactions.push(sellTransactions[sellTransactionPointer])
            sellTransactionPointer++
        }
        correspondingTransactions.forEach(sell => {
            logs.push({
                shipSymbol,
                tradeGoodSymbol: sell.tradeSymbol,
                sellWaypointSymbol: sell.waypointSymbol,
                purchaseWaypointSymbol: purchase.waypointSymbol,
                sellPrice: sell.pricePerUnit,
                sellAmount: sell.units,
                purchasePrice: purchase.pricePerUnit,
                purchaseAmount: purchase.units,
            })
        })

    })

    return logs
}
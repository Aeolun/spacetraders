import {prisma} from "@common/prisma";
import axios from "axios";

export const updateMarketPrices = async () => {
    const marketprices = await axios.get('https://st.feba66.de/prices')

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
}


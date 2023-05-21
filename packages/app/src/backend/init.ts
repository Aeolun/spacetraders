import {prisma} from "@app/prisma";
import axios from "axios";
import {backgroundQueue} from "@app/lib/queue";
import {storeWaypointScan} from "@app/ship/storeResults";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import createApi from "@app/lib/createApi";

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

export const loadWaypoint = async () => {
    const token = await getBackgroundAgentToken()
    const api = createApi(token)

    const systems = await prisma.system.findMany({
        where: {
            waypointsRetrieved: false
        }
    })
    console.log("Loading waypoint information for all unscanned systems")
    let i = 0;
    for (const system of systems) {
        await backgroundQueue(async () => {
            i++

            const allWaypoints = await api.systems.getSystemWaypoints(system.symbol, 1, 20)
            console.log(`${i}/${systems.length}: got all waypoints for ${system.name} (${system.symbol}): ${allWaypoints.data.data.length}`)
            await storeWaypointScan(system.symbol, allWaypoints.data)
        })
    }
}
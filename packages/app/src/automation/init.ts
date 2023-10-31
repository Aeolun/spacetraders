import {prisma} from "@common/prisma";
import axios from "axios";
import {backgroundQueue} from "@auto/lib/queue";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import createApi from "@common/lib/createApi";
import throttledQueue from "throttled-queue";
import {WaypointTrait} from "spacetraders-sdk";
import {storeWaypointScan} from "@common/lib/data-update/store-waypoint-scan";
import {storeMarketInformation} from "@common/lib/data-update/store-market-information";
import {processShip} from "@common/lib/data-update/store-ship";

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
    
    const hq = await prisma.$queryRaw<{x: number, y: number}[]>`SELECT * FROM \`System\` s INNER JOIN Ship sh ON sh.currentSystemSymbol = s.symbol WHERE sh.symbol = ${process.env.AGENT_NAME+'-1'} LIMIT 1`

    const systems = await prisma.$queryRaw<{ name: string, symbol: string }[]>`SELECT * FROM \`System\` s WHERE waypointsRetrieved = false ORDER BY SQRT(POW(ABS(s.x - ${hq[0].x}), 2) + POW(ABS(s.y - ${hq[0].y}), 2)) ASC`
    console.log("Loading waypoint information for all unscanned systems")
    let i = 0;
    for (const system of systems) {

        i++

        try {
            const allWaypoints = await backgroundQueue(async () => api.systems.getSystemWaypoints(system.symbol, 1, 20))
            console.log(`${i}/${systems.length}: got all waypoints for ${system.name} (${system.symbol}): ${allWaypoints.data.data.length}`)
            await storeWaypointScan(system.symbol, allWaypoints.data)

            for(const waypoint of allWaypoints.data.data) {
                if (waypoint.traits.find( t => t.symbol === 'MARKETPLACE')) {
                    const marketInfo = await backgroundQueue(async () => api.systems.getMarket(system.symbol, waypoint.symbol))
                    await storeMarketInformation(marketInfo.data)
                }
            }
        } catch(error) {
            console.error('failure loading waypoints', error)
        }

    }
}
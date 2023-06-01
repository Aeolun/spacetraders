import {prisma} from "@app/prisma";

interface TradeInfo {
    purchaseWaypoint: string
    sellWaypoint: string
    sellSystem: string
    tradeGoodSymbol: string
    purchasePrice: number
    purchaseSystem: string
    sellPrice: number
    buyVolume: number
    sellVolume: number
}
function getTradesBetween(fromSystem: string, toSystem: string) {
    return prisma.$queryRaw<TradeInfo[]>`
        SELECT mp.waypointSymbol purchaseWaypoint, mp.tradeGoodSymbol, mp.purchasePrice, w.systemSymbol purchaseSystem, w2.systemSymbol sellSystem, mp2.waypointSymbol sellWaypoint, mp2.sellPrice, mp.tradeVolume buyVolume, mp2.tradeVolume sellVolume, (mp2.sellPrice-mp.purchasePrice)*LEAST(mp.tradeVolume, mp2.tradeVolume) totalProfit FROM MarketPrice mp INNER JOIN MarketPrice mp2 ON mp.tradeGoodSymbol = mp2.tradeGoodSymbol INNER JOIN Waypoint w ON mp.waypointSymbol = w.symbol INNER JOIN Waypoint w2 ON mp2.waypointSymbol = w2.symbol  WHERE w.systemSymbol = ${fromSystem} AND w2.systemSymbol = ${toSystem} AND mp.purchasePrice < mp2.sellPrice AND LEAST(mp.tradeVolume, mp2.tradeVolume) * (mp2.sellPrice-mp.purchasePrice) > 500 ORDER BY totalProfit DESC LIMIT 1
    `
}

interface Trade {
    from: string
    to: string
    trades: TradeInfo[]
}
export async function findTradesBetweenSystems(route: string[]) {
    const allTrades: Trade[] = []
    for(let i = 0; i < route.length; i++) {
        for(let j = i; j < route.length; j++) {
            const tradesBetween = await getTradesBetween(route[i], route[j])
            if (tradesBetween.length > 0) {
                allTrades.push({
                    from: route[i],
                    to: route[j],
                    trades: tradesBetween
                })
            }
        }
    }

    return allTrades
}

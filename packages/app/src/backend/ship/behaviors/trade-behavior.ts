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

            const minProfit = 100

            const currentMoneyResult = await ship.api.agents.getMyAgent()
            let currentMoney = currentMoneyResult.data.data.credits
            const cargo = await ship.currentCargo()
            const cargoCapacity = cargo.cargoCapacity
            const cargoValue = cargo.cargoCapacity - cargo.cargoUsed

            const sellableCargo = cargo.cargo.filter(c => c.tradeGoodSymbol !== 'ANTIMATTER')

            if (sellableCargo.length > 0) {
                // need to sell cargo, make a trade for that

                const whereToSell = await prisma.$queryRaw<{
                    waypointSymbol: string
                    systemSymbol: string
                    totalDistance: number
                    sellPrice: number
                }[]>`select mp.waypointSymbol,
                           mp.sellPrice,
                           wp.systemSymbol,
                           jd.totalDistance
                    from MarketPrice mp
                             inner join Waypoint wp on
                        wp.symbol = mp.waypointSymbol
                             inner join \`System\` s on
                        s.symbol = wp.systemSymbol
                             inner join JumpDistance jd on
                        jd.fromSystemSymbol = ${currentSystem.symbol} and jd.toSystemSymbol = s.symbol
                    where mp.tradeGoodSymbol = ${sellableCargo[0].tradeGoodSymbol}
                      and s.hasJumpGate = true
                      and mp.updatedOn > NOW() - INTERVAL 8 HOUR
                    order by
                        (${sellableCargo[0].units} * mp.sellPrice) - (jd.jumps * 1000) desc
                        limit 10`

                if (!whereToSell || whereToSell.length <= 0) {
                    ship.log(`Cannot find place to sell current cargo, waiting for a bit.`)
                    await ship.setOverallGoal(`Waiting for decent place to sell cargo.`)
                    await ship.waitFor(60000)
                } else {
                    ship.log(`Going to sell ${sellableCargo[0].units} of ${sellableCargo[0].tradeGoodSymbol} in ${whereToSell[0].waypointSymbol}, ${whereToSell[0].totalDistance} away for ${whereToSell[0].sellPrice}`)
                    await ship.setOverallGoal(`Selling ${sellableCargo[0].units} ${sellableCargo[0].tradeGoodSymbol} in ${whereToSell[0].waypointSymbol}`)

                    const shipData = await prisma.ship.findFirstOrThrow({
                        where: {
                            symbol: ship.symbol
                        }
                    })
                    await ship.dock()
                    await ship.attemptRefuel()
                    await ship.orbit()
                    await travelBehavior(whereToSell[0].systemSymbol, ship, whereToSell[0].waypointSymbol)
                    await ship.navigate(whereToSell[0].waypointSymbol)
                    await ship.dock()
                    await ship.sellCargo(sellableCargo[0].tradeGoodSymbol, sellableCargo[0].units)
                    await ship.orbit()

                    await ship.setOverallGoal(null)
                }
            } else {

                const bestTrades = await prisma.$queryRaw<{
                    buySystem: string
                    buyAt: string
                    buySupply: string
                    sellSystem: string
                    sellAt: string
                    sellSupply: string
                    buyVolume: number
                    sellVolume: number
                    tradeVolume: number
                    disSys: number
                    tradeGoodSymbol: string
                    purchasePrice: number
                    sellPrice: number
                    totalProfit: number
                    since: string
                }[]>`select
	s1.symbol buySystem,
	m1.waypointSymbol as buyAt,
	m1.supply as buySupply,
	gatewp1.symbol as buyGate,
	s2.symbol sellSystem,
	m2.waypointSymbol as sellAt,
	gatewp2.symbol as sellGate,
	m2.supply as sellSupply,
	m1.tradeVolume as buyVolume,
	m2.tradeVolume as sellVolume,
    ROUND(LEAST(${cargoValue},
                ${currentMoney} / m1.purchasePrice,
                m1.tradeVolume, m2.tradeVolume)) as tradeVolume,
	ROUND(SQRT(POW(ABS(wp1.x - wp2.x), 2) + POW(ABS(wp1.y - wp2.y), 2))) as dis,
	ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2))) as disSys,
	jd.totalDistance jumpDistance,
	jd2.totalDistance distanceToStart,
	m1.tradeGoodSymbol,
	m1.purchasePrice,
	m2.sellPrice,
	ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) totalProfit,
	ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) / ROUND((jd.totalDistance+jd2.totalDistance)/10+60) creditsPerSecond,
	ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice))/ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2)))  as totalPerRunDistance,
	LEAST(m1.updatedOn, m2.updatedOn) as since
from
	MarketPrice as m1
join MarketPrice as m2 on
	m1.tradeGoodSymbol = m2.tradeGoodSymbol
	and m1.waypointSymbol != m2.waypointSymbol
join Waypoint as wp1 on
	m1.waypointSymbol = wp1.symbol
join Waypoint as wp2 on
	m2.waypointSymbol = wp2.symbol
join \`System\` as s1 on
	wp1.systemSymbol = s1.symbol
join \`System\` as s2 on
	wp2.systemSymbol = s2.symbol
join Waypoint gatewp1 on gatewp1.type = 'JUMP_GATE' and gatewp1.systemSymbol = s1.symbol 
join Waypoint gatewp2 on gatewp2.type = 'JUMP_GATE' and gatewp2.systemSymbol = s2.symbol 
left join JumpDistance jd on jd.fromSystemSymbol = s1.symbol and jd.toSystemSymbol =s2.symbol
left join JumpDistance jd2 on jd2.fromSystemSymbol = ${currentSystem.symbol} and jd2.toSystemSymbol = s1.symbol
where
	m1.purchasePrice < m2.sellPrice
	and ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) > ${minProfit}
	and LEAST(m1.updatedOn, m2.updatedOn) > NOW() - INTERVAL 4 HOUR
order by
	creditsPerSecond desc;`

                if (Array.isArray(bestTrades) && bestTrades.length <= 0) {
                    console.log(`No more profitable trades within ${range} of ${fromSystem}, waiting for a bit`)
                    await ship.waitUntil(new Date(Date.now() + 1000 * 60).toISOString())
                    continue;
                } else if(Array.isArray(bestTrades)) {
                    console.log(`Found ${bestTrades.length} trades`)
                }

                const allowedTrades = bestTrades.filter(t => !tradeTaken.has(t.buyAt+t.sellAt+t.tradeGoodSymbol))

                const bestTrade = allowedTrades[0]

                const route = await defaultWayfinder.findJumpRoute(currentSystem.symbol, bestTrade.buySystem);
                const extraRoute = await defaultWayfinder.findJumpRoute(bestTrade.buySystem, bestTrade.sellSystem);

                const fullRoute = []
                route.finalPath.forEach(p => {
                    fullRoute.push(p.source)
                })

                extraRoute.finalPath.forEach(p => {
                    fullRoute.push(p.source)
                })
                fullRoute.push(extraRoute.finalPath[extraRoute.finalPath.length - 1].target)
                console.log(JSON.stringify(fullRoute))

                ship.log(`Going to trade ${bestTrade.tradeGoodSymbol}, sold at ${bestTrade.purchasePrice}, purchased at ${bestTrade.sellPrice}, total profit ${bestTrade.totalProfit}`)
                tradeTaken.add(bestTrade.buyAt+bestTrade.sellAt+bestTrade.tradeGoodSymbol)
                await ship.setOverallGoal(`Trade ${bestTrade.tradeVolume} ${bestTrade.tradeGoodSymbol} from ${bestTrade.buyAt} to ${bestTrade.sellAt}`)

                const good = bestTrade.tradeGoodSymbol

                const extraTrades = await findTradesBetweenSystems(fullRoute);
                ship.log(`Found ${extraTrades.length} extra trades we can potentially make along route.`)

                const madeTrades = []

                await travelBehavior(bestTrade.buySystem, ship, bestTrade.buyAt, {
                    executeEveryStop: async () => {
                        const initialLocation = ship.currentWaypointSymbol


                        const sellInThisSystem = extraTrades.filter(t => t.to === ship.currentSystemSymbol)
                        for(const sys of sellInThisSystem) {
                            for (const trade of sys.trades) {
                                const cargo = await prisma.shipCargo.findMany({
                                    where: {
                                        shipSymbol: ship.symbol
                                    }
                                })
                                const inCargo = cargo.find(c => c.tradeGoodSymbol == trade.tradeGoodSymbol)
                                if (inCargo) {
                                    ship.log(`Extra stop in ${ship.currentSystemSymbol} to sell ${trade.tradeGoodSymbol}`)
                                    await ship.navigate(trade.sellWaypoint)
                                    await ship.dock()
                                    await ship.attemptRefuel()
                                    await ship.sellCargo(trade.tradeGoodSymbol, Math.min(trade.buyVolume, trade.sellVolume, inCargo.units))
                                }
                            }
                        }


                        const purchaseInThisSystem = extraTrades.filter(t => t.from === ship.currentSystemSymbol)
                        for(const sys of purchaseInThisSystem) {
                            for (const trade of sys.trades) {
                                const newCargo = await prisma.shipCargo.findMany({
                                    where: {
                                        shipSymbol: ship.symbol
                                    }
                                })

                                const spaceAvailable = cargoCapacity - newCargo.reduce((total, c) => total + c.units, 0) - bestTrade.buyVolume
                                const buyAmount = Math.min(trade.buyVolume, trade.sellVolume, spaceAvailable)

                                const currentWaypoint = await prisma.waypoint.findFirst({
                                    where: {
                                        symbol: ship.currentWaypointSymbol
                                    }
                                })
                                const purchaseWaypoint = await prisma.waypoint.findFirst({
                                    where: {
                                        symbol: trade.purchaseWaypoint
                                    }
                                })
                                const sellWaypoint = await prisma.waypoint.findFirst({
                                    where: {
                                        symbol: trade.sellWaypoint
                                    }
                                })
                                const sellJumpGate = await prisma.waypoint.findFirst({
                                    where: {
                                        symbol: trade.sellSystem,
                                        type: "JUMP_GATE"
                                    }
                                })

                                if ((currentWaypoint && purchaseWaypoint && sellJumpGate && sellWaypoint) &&
                                    spaceAvailable > 0 && buyAmount * (trade.sellPrice - trade.purchasePrice) > getFuelCost(currentWaypoint, purchaseWaypoint) + getFuelCost(sellJumpGate, sellWaypoint)) {
                                    ship.log(`Extra stop in ${ship.currentSystemSymbol} to purchase ${trade.tradeGoodSymbol}`)
                                    await ship.navigate(trade.purchaseWaypoint)
                                    await ship.dock()
                                    await ship.attemptRefuel()

                                    const market = await ship.market()
                                    const whatToBuy = market.tradeGoods.find(item => item.symbol === trade.tradeGoodSymbol);
                                    if (whatToBuy.purchasePrice < trade.sellPrice) {
                                        await ship.purchaseCargo(trade.tradeGoodSymbol, Math.min(trade.buyVolume, trade.sellVolume, spaceAvailable))
                                    }
                                }
                            }
                        }
                        // go back to where you came from
                        await ship.navigate(initialLocation)
                    }
                })
                await ship.navigate(bestTrade.buyAt)
                await ship.dock()
                const buyMarketInfo = await ship.market()
                let shipData = await prisma.ship.findFirstOrThrow({
                    where: {
                        symbol: ship.symbol
                    }
                })
                await ship.attemptRefuel()
                const thingToBuy = buyMarketInfo.tradeGoods.find(i => i.symbol == good)

                let totalCount = 0
                let maxPurchaseAmount = 0
                let thingBought: MarketTradeGood | undefined
                let firstPurchase: MarketTradeGood | undefined = thingToBuy
                let availableCargoSpace = cargo.cargoCapacity - cargo.cargoUsed
                const buyTransactions: MarketTransaction[] = []
                do {
                    const newCurrentMoneyResult = await ship.queue(() => ship.api.agents.getMyAgent())
                    currentMoney = newCurrentMoneyResult.data.data.credits

                    maxPurchaseAmount = Math.min(availableCargoSpace, thingToBuy.tradeVolume, thingToBuy.purchasePrice > 10000 ? bestTrade.sellVolume * 3 : thingToBuy.tradeVolume, Math.floor(currentMoney / thingToBuy.purchasePrice))
                    console.log("Maximum to buy is " + maxPurchaseAmount)
                    buyTransactions.push(await ship.purchaseCargo(good, maxPurchaseAmount))

                    const marketInfoAfter = await ship.market()
                    thingBought = marketInfoAfter.tradeGoods.find(i => i.symbol == good)
                    console.log(`Price changed from ${thingToBuy.purchasePrice} -> ${thingBought.purchasePrice}`)
                    totalCount += maxPurchaseAmount
                    availableCargoSpace -= maxPurchaseAmount
                } while(thingBought && maxPurchaseAmount > 0 && thingBought.purchasePrice < bestTrade.sellPrice && totalCount < bestTrade.sellVolume)

                await travelBehavior(bestTrade.sellSystem, ship, bestTrade.sellAt)
                await ship.navigate(bestTrade.sellAt)


                let thingToSell
                do {
                    const saleMarketInfo = await ship.market()
                    thingToSell = saleMarketInfo.tradeGoods.find(good => good.symbol === bestTrade.tradeGoodSymbol)

                    if (thingToSell.sellPrice < firstPurchase.purchasePrice) {
                        ship.log(`Crap, price changed while traveling bought ${bestTrade.tradeGoodSymbol} for ${firstPurchase.purchasePrice}, but selling at ${saleMarketInfo.symbol} for ${thingToSell.sellPrice}`)

                        // allow selling at a slight loss to get unstuck
                        const alternativeSaleLocation = await prisma.$queryRaw<{
                                    waypointSymbol: string
                                    systemSymbol: string
                                    sellPrice: number
                                }[]>`select mp.waypointSymbol,
                                   mp.sellPrice,
                                   wp.systemSymbol,
                                   jd.totalDistance,
                                   mp.sellPrice / jd.totalDistance priceToDistance
                            from MarketPrice mp
                                     inner join Waypoint wp on
                                wp.symbol = mp.waypointSymbol
                                     inner join \`System\` s on
                                s.symbol = wp.systemSymbol
                                     inner join JumpDistance jd on
                                jd.fromSystemSymbol = ${currentSystem.symbol} and jd.toSystemSymbol = s.symbol
                            where mp.tradeGoodSymbol = ${bestTrade.tradeGoodSymbol}
                              and s.hasJumpGate = true
                              and mp.sellPrice > ${firstPurchase.purchasePrice} * 0.9
                              and mp.updatedOn > NOW() - INTERVAL 4 HOUR
                            order by
                                priceToDistance desc
                                limit 10`

                        if (alternativeSaleLocation.length > 0 && alternativeSaleLocation[0].sellPrice > thingToSell.sellPrice) {
                            ship.log(`Going to ${alternativeSaleLocation[0].waypointSymbol} to sell there for ${alternativeSaleLocation[0].sellPrice} instead.`)
                            await travelBehavior(alternativeSaleLocation[0].systemSymbol, ship, alternativeSaleLocation[0].waypointSymbol)
                        } else {
                            ship.log(`No alternative sale location found for a decent enough price.`)
                            await ship.setOverallGoal("Waiting for price increase.")
                            await ship.waitFor(120000)
                        }
                    }
                } while(thingToSell.sellPrice < thingToBuy.purchasePrice*0.9)

                await ship.dock()
                const sellTransactions = await ship.sellAllCargo()
                //generateLogsFromBuyAndSell(buyTransactions, sellTransactions)


                shipData = await prisma.ship.findFirstOrThrow({
                    where: {
                        symbol: ship.symbol
                    }
                })
                await ship.attemptRefuel()

                const soldMarket = await ship.market()
                const thingSold = soldMarket.tradeGoods.find(i => i.symbol == good)
                console.log(`Sell price of item is now ${thingSold.sellPrice}`)
                tradeTaken.delete(bestTrade.buyAt+bestTrade.sellAt+bestTrade.tradeGoodSymbol)
                await ship.setOverallGoal(null)
            }
        } catch(error) {
            console.log("Unexpected issue in agent, restarting in 60s: ",error?.response?.data ? error?.response?.data : error)
            await ship.waitFor(60000)

            started = false
        }
    }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}
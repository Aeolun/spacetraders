import {Ship} from "@auto/ship/ship";
import {prisma} from "@common/prisma";
import {travelBehavior} from "@auto/ship/behaviors/travel-behavior";
import {defaultWayfinder} from "@auto/wayfinding";
import {findTradesBetweenSystems} from "@auto/findTradesBetweenSystems";
import {BehaviorParameters} from "@auto/ship/shipBehavior";
import { getFuelCost } from "@common/lib/getFuelCost";
import { MarketTradeGood, MarketTransaction } from "spacetraders-sdk";

const tradeTaken = new Set([] as string[])
export const tradeLogic = async (ship: Ship, parameters: BehaviorParameters) => {
    const currentSystem = await prisma.system.findFirstOrThrow({
        where: {
            symbol: ship.currentSystemSymbol
        }
    })

    const minProfit = 2000

    const currentMoneyResult = await ship.api.agents.getMyAgent()
    let currentMoney = currentMoneyResult.data.data.credits
    const cargo = await ship.currentCargo()
    const cargoCapacity = cargo.cargoCapacity
    const cargoValue = cargo.cargoCapacity - cargo.cargoUsed

    const sellableCargo = cargo.cargo.filter(c => c.tradeGoodSymbol !== 'ANTIMATTER')

    console.log('sellable cargo', sellableCargo)

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
                     left join JumpDistance jd on
                jd.fromSystemSymbol = ${currentSystem.symbol} and jd.toSystemSymbol = s.symbol
            where mp.tradeGoodSymbol = ${sellableCargo[0].tradeGoodSymbol}
              and s.hasJumpGate = true
              and mp.updatedOn > NOW() - INTERVAL 8 HOUR
            order by
                mp.sellPrice desc
                limit 10`

        if (!whereToSell || whereToSell.length <= 0) {
            ship.log(`Cannot find place to sell current cargo, waiting for a bit.`)
            await ship.setObjective(`Waiting for decent place to sell cargo.`)
            await ship.waitFor(60000)
        } else {
            ship.log(`Going to sell ${sellableCargo[0].units} of ${sellableCargo[0].tradeGoodSymbol} in ${whereToSell[0].waypointSymbol}, ${whereToSell[0].totalDistance} away for ${whereToSell[0].sellPrice}`)
            await ship.setObjective(`Selling ${sellableCargo[0].units} ${sellableCargo[0].tradeGoodSymbol} in ${whereToSell[0].waypointSymbol}`)

            const shipData = await prisma.ship.findFirstOrThrow({
                where: {
                    symbol: ship.symbol
                }
            })
            await ship.dock()
            await ship.attemptRefuel()
            await ship.orbit()
            await travelBehavior(whereToSell[0].systemSymbol, ship, whereToSell[0].waypointSymbol, {
                jumpOnly: true
            })
            await ship.navigate(whereToSell[0].waypointSymbol)
            await ship.dock()
            await ship.sellCargo(sellableCargo[0].tradeGoodSymbol, sellableCargo[0].units)
            await ship.orbit()

            await ship.setObjective(null)
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
            disStart: number
            tradeGoodSymbol: string
            purchasePrice: number
            sellPrice: number
            totalProfit: number
            since: string
            totalPerRunDistance: number
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
ROUND(SQRT(POW(ABS(sts.x - s1.x), 2) + POW(ABS(sts.y - s1.y), 2))) as disStart,
jd.totalDistance jumpDistance,
jd2.totalDistance distanceToStart,
m1.tradeGoodSymbol,
m1.purchasePrice,
m2.sellPrice,
ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) totalProfit,
ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) / ROUND((jd.totalDistance+jd2.totalDistance)/10+60) creditsPerSecond,
ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice))/(ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2)))+ROUND(SQRT(POW(ABS(sts.x - s1.x), 2) + POW(ABS(sts.y - s1.y), 2))))  as totalPerRunDistance,
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
join \`System\` as sts on
sts.symbol = ${currentSystem.symbol}
join Waypoint gatewp1 on gatewp1.type = 'JUMP_GATE' and gatewp1.systemSymbol = s1.symbol 
join Waypoint gatewp2 on gatewp2.type = 'JUMP_GATE' and gatewp2.systemSymbol = s2.symbol 
left join JumpDistance jd on jd.fromSystemSymbol = s1.symbol and jd.toSystemSymbol =s2.symbol
left join JumpDistance jd2 on jd2.fromSystemSymbol = ${currentSystem.symbol} and jd2.toSystemSymbol = s1.symbol
where
m1.purchasePrice < m2.sellPrice
and ROUND(LEAST(${cargoValue}, ${currentMoney} / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) > ${minProfit}
and LEAST(m1.updatedOn, m2.updatedOn) > NOW() - INTERVAL 4 HOUR
order by
creditsPerSecond desc, totalPerRunDistance desc LIMIT 50;`

        if (Array.isArray(bestTrades) && bestTrades.length <= 0) {
            ship.log(`No more profitable trades found.`)
            await ship.setObjective('Wait for trades')
            await ship.waitFor(1000 * 60)
            return;
        } else if(Array.isArray(bestTrades)) {
            console.log(`Found ${bestTrades.length} trades`)
        }

        const allowedTrades = bestTrades.filter(t => !tradeTaken.has(t.buyAt+t.sellAt+t.tradeGoodSymbol))

        if (allowedTrades.length <= 0) {
            ship.log(`All profitable trades already taken.`)
            await ship.setObjective('Wait for trades')
            await ship.waitFor(1000 * 60)
            return;
        }

        const bestTrade = allowedTrades[0]

        const fullRoute = []

        try {
            console.log('best trade', bestTrade)
            const routeAlgo = ship.hasWarpDrive ? defaultWayfinder.findRoute.bind(defaultWayfinder) : defaultWayfinder.findJumpRoute.bind(defaultWayfinder)
            const route = await routeAlgo(currentSystem.symbol, bestTrade.buySystem, {
                current: ship.fuel,
                max: ship.maxFuel
            });
            const extraRoute = await routeAlgo(bestTrade.buySystem, bestTrade.sellSystem, {
                current: ship.fuel,
                max: ship.maxFuel
            });


            route.finalPath.forEach(p => {
                fullRoute.push(p.source)
            })

            extraRoute.finalPath.forEach(p => {
                fullRoute.push(p.source)
            })

            if (extraRoute.finalPath.length > 0) {
                fullRoute.push(extraRoute.finalPath[extraRoute.finalPath.length - 1].target)
            }
        } catch (e) {
            console.error(e)
            await ship.setObjective(null)
            await ship.waitFor(60000)
            return;
        }

        try {

            ship.log(`Going to trade ${bestTrade.tradeVolume} ${bestTrade.tradeGoodSymbol}, sold at ${bestTrade.purchasePrice}, purchased at ${bestTrade.sellPrice}, total profit ${bestTrade.totalProfit}, tprd ${bestTrade.totalPerRunDistance}, dissta ${bestTrade.disStart}`)

            tradeTaken.add(bestTrade.buyAt + bestTrade.sellAt + bestTrade.tradeGoodSymbol)
            await ship.setObjective(`Trade ${bestTrade.tradeVolume} ${bestTrade.tradeGoodSymbol} from ${bestTrade.buyAt} to ${bestTrade.sellAt}`)

            const good = bestTrade.tradeGoodSymbol

            const extraTrades = await findTradesBetweenSystems(fullRoute);
            ship.log(`Found ${extraTrades.length} extra trades we can potentially make along route.`)

            const madeTrades = []

            await travelBehavior(bestTrade.buySystem, ship, bestTrade.buyAt, {
                executeEveryStop: async () => {
                    const initialLocation = ship.currentWaypointSymbol


                    const sellInThisSystem = extraTrades.filter(t => t.to === ship.currentSystemSymbol)
                    for (const sys of sellInThisSystem) {
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
                    for (const sys of purchaseInThisSystem) {
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
                if (maxPurchaseAmount > 0) {
                    ship.log("Maximum to buy is " + maxPurchaseAmount)
                    buyTransactions.push(await ship.purchaseCargo(good, maxPurchaseAmount))

                    const marketInfoAfter = await ship.market()
                    thingBought = marketInfoAfter.tradeGoods.find(i => i.symbol == good)
                    ship.log(`Price changed from ${thingToBuy.purchasePrice} -> ${thingBought.purchasePrice}`)
                    totalCount += maxPurchaseAmount
                    availableCargoSpace -= maxPurchaseAmount
                }
            } while (thingBought && maxPurchaseAmount > 0 && thingBought.purchasePrice < bestTrade.sellPrice && totalCount < bestTrade.sellVolume)

            await travelBehavior(bestTrade.sellSystem, ship, bestTrade.sellAt, {
                jumpOnly: true
            })
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
                        await travelBehavior(alternativeSaleLocation[0].systemSymbol, ship, alternativeSaleLocation[0].waypointSymbol, {
                            jumpOnly: true
                        })
                    } else {
                        ship.log(`No alternative sale location found for a decent enough price.`)
                        await ship.setObjective("Waiting for price increase.")
                        await ship.waitFor(120000)
                    }
                }
            } while (thingToSell.sellPrice < thingToBuy.purchasePrice * 0.9)

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
            tradeTaken.delete(bestTrade.buyAt + bestTrade.sellAt + bestTrade.tradeGoodSymbol)
            await ship.setObjective(null)
        } catch(e) {
            tradeTaken.delete(bestTrade.buyAt+bestTrade.sellAt+bestTrade.tradeGoodSymbol)
            throw e
        }
    }
}
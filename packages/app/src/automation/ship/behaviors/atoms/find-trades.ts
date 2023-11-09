import {Ship} from "@auto/ship/ship";
import {prisma} from "@common/prisma";
import {environmentVariables} from "@common/environment-variables";
import {TradeSymbol} from "spacetraders-sdk";

interface Trade {
  fromWaypointSymbol: string;
  toWaypointSymbol: string;
  tradeSymbol: TradeSymbol;
  amount: number;
}

export const findTrades = async (): Promise<Trade[]> => {
  const cargoValue = 70;
  const currentAgent = await prisma.agent.findFirstOrThrow({
    where: {
      symbol: environmentVariables.agentName,
    },
    orderBy: {
      reset: 'desc'
    }
  });
  const currentMoney = currentAgent.credits
  const minProfit = 1000;

  const bestTrades = await prisma.$queryRaw<{
    buysystem: string
    buyat: string
    buysupply: string
    sellsystem: string
    sellat: string
    sellsupply: string
    buyvolume: number
    sellvolume: number
    tradevolume: number
    dissys: number
    perunitprofit: number
    tradeGoodSymbol: string
    purchasePrice: number
    sellPrice: number
    totalprofit: number
    since: string
  }[]>`select
s1.symbol buySystem,
m1."waypointSymbol" as buyAt,
m1.supply as buySupply,
gatewp1.symbol as buyGate,
s2.symbol sellSystem,
m2."waypointSymbol" as sellAt,
gatewp2.symbol as sellGate,
m2.supply as sellSupply,
m1."tradeVolume" as buyVolume,
m2."tradeVolume" as sellVolume,
ROUND(LEAST(${cargoValue},
        ${currentMoney} / m1."purchasePrice",
        m1."tradeVolume", m2."tradeVolume")) as tradeVolume,
ROUND(SQRT(POW(ABS(wp1.x - wp2.x), 2) + POW(ABS(wp1.y - wp2.y), 2))) as dis,
ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2))) as disSys,
jd."totalDistance" jumpDistance,
m1."tradeGoodSymbol",
m1."purchasePrice",
m2."sellPrice",
m2."sellPrice" - m1."purchasePrice" as perunitprofit,
ROUND(LEAST(${cargoValue}, ${currentMoney} / m1."purchasePrice", m1."tradeVolume", m2."tradeVolume") * (m2."sellPrice" - m1."purchasePrice")) totalProfit,
LEAST(m1."updatedOn", m2."updatedOn") as since
from
"MarketPrice" as m1
join "MarketPrice" as m2 on
m1."tradeGoodSymbol" = m2."tradeGoodSymbol"
and m1."waypointSymbol" != m2."waypointSymbol"
join "Waypoint" as wp1 on
m1."waypointSymbol" = wp1.symbol
join "Waypoint" as wp2 on
m2."waypointSymbol" = wp2.symbol
join "System" as s1 on
wp1."systemSymbol" = s1.symbol
join "System" as s2 on
wp2."systemSymbol" = s2.symbol
join "Waypoint" gatewp1 on gatewp1.type = 'JUMP_GATE' and gatewp1."systemSymbol" = s1.symbol 
join "Waypoint" gatewp2 on gatewp2.type = 'JUMP_GATE' and gatewp2."systemSymbol" = s2.symbol 
left join "JumpDistance" jd on jd."fromSystemSymbol" = s1.symbol and jd."toSystemSymbol" =s2.symbol
where
m1."purchasePrice" < m2."sellPrice"
and ROUND(LEAST(${cargoValue}, ${currentMoney} / m1."purchasePrice", m1."tradeVolume", m2."tradeVolume") * (m2."sellPrice" - m1."purchasePrice")) > ${minProfit}
order by
perunitprofit desc LIMIT 10;`;



  return bestTrades.map(trade => {
    const safeBuyVolume = [
      'ABUNDANT',
      'HIGH'
    ].includes(trade.buysupply) ? trade.buyvolume * 10 : trade.buyvolume;
    const safeSellVolume = [
      'LIMITED',
      'SCARCE'
    ].includes(trade.sellsupply) ? trade.sellvolume * 10 : trade.sellvolume;
    const totalProfit = Math.min(safeBuyVolume, safeSellVolume) * trade.perunitprofit;
    return {
      fromWaypointSymbol: trade.buyat,
      toWaypointSymbol: trade.sellat,
      tradeSymbol: trade.tradeGoodSymbol as TradeSymbol,
      unitProfit: trade.perunitprofit,
      amount: Math.min(safeBuyVolume, safeSellVolume),
      totalProfit: totalProfit
    }
  }).sort((a, b) => b.unitProfit - a.unitProfit);
}
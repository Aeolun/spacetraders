import {Ship} from "@auto/ship/ship";
import {prisma, Prisma, MarketGoodActivityLevel} from "@common/prisma";
import {environmentVariables} from "@common/environment-variables";
import {TradeSymbol} from "spacetraders-sdk";
import {importToExportMap} from "@common/import-export-map";

interface Trade {
  fromWaypointSymbol: string;
  toWaypointSymbol: string;
  tradeSymbol: TradeSymbol;
  purchasePrice: number;
  sellPrice: number;
  amount: number;
  priority: number;
  unitProfit: number;
  maxProfit: number;
  profitPerDistance: number;
  totalProfit: number;
  buyActivity: string;
  sellActivity: string;
  reservation: number;
  dis: number;
  sellKind: string;
  buyKind: string;
  buySupply: string;
  sellSupply: string;
  buyVolume: number;
  sellVolume: number;
  associatedExports: {
    tradeGoodSymbol: string;
    tradeVolume: number;
    activityLevel: MarketGoodActivityLevel | null;
  }[];
}

const priorityLevels: Record<string, number> = {
  'ABUNDANT': 4,
  'HIGH': 3,
  'MODERATE': 2,
  'LIMITED': 1,
  'SCARCE': 0,
}

const activityPriority: Record<string, number> = {
  'RESTRICTED': 3,
  'WEAK': 2,
  'GROWING': 1,
  'STRONG': 0,
}

export const findTrades = async (data: {
  dbLimit: number,
  resultLimit: number,
  systemSymbols: string[],
  route?: {
    fromWaypointSymbol: string,
    toWaypointSymbol: string,
  },
  moneyImportance?: number
}): Promise<Trade[]> => {
  const cargoValue = 70;
  const moneyImportance = data.moneyImportance ?? 1;
  console.log("importance of money", moneyImportance)
  const currentAgent = await prisma.agent.findFirstOrThrow({
    where: {
      symbol: environmentVariables.agentName,
    },
    orderBy: {
      reset: 'desc'
    }
  });
  const currentMoney = currentAgent.credits
  const minProfit = -3000;
  const defaultCargoVolume = 80;

  const query = `select
s1.symbol "buySystem",
m1."waypointSymbol" as "buyAt",
m1.supply as "buySupply",
m1.kind as "buyKind",
gatewp1.symbol as "buyGate",
s2.symbol "sellSystem",
m2."waypointSymbol" as "sellAt",
gatewp2.symbol as "sellGate",
m2.supply as "sellSupply",
m2.kind as "sellKind",
m1."tradeVolume" as "buyVolume",
m2."tradeVolume" as "sellVolume",
m1."activityLevel" as "buyActivity",
m2."activityLevel" as "sellActivity",
ROUND(LEAST(${cargoValue},
        ${currentMoney} / m1."purchasePrice",
        m1."tradeVolume", m2."tradeVolume")) as "tradeVolume",
ROUND(SQRT(POW(ABS(wp1.x - wp2.x), 2) + POW(ABS(wp1.y - wp2.y), 2))) as "dis",
ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2))) as "disSys",
jd."totalDistance" "jumpDistance",
m1."tradeGoodSymbol",
m1."purchasePrice",
m2."sellPrice",
m2."sellPrice" - m1."purchasePrice" as "perUnitProfit",
ROUND(LEAST(${cargoValue}, ${currentMoney} / m1."purchasePrice", m1."tradeVolume", m2."tradeVolume") * (m2."sellPrice" - m1."purchasePrice")) "totalProfit",
LEAST(m1."updatedOn", m2."updatedOn") as "since"
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
(m2."sellPrice" - m1."purchasePrice") * ${defaultCargoVolume} - ROUND(SQRT(POW(ABS(wp1.x - wp2.x), 2) + POW(ABS(wp1.y - wp2.y), 2))) > ${minProfit}
and wp1."systemSymbol" IN (${data.systemSymbols.map(s => `'${s}'`).join(', ')}) and wp2."systemSymbol" IN (${data.systemSymbols.map(s => `'${s}'`).join(',')})
and (m1."purchasePrice" < m2."sellPrice" * 0.75 OR m1."tradeGoodSymbol" LIKE '%_ORE')
${data.route ? `and m1."waypointSymbol" = '${data.route.fromWaypointSymbol}' and m2."waypointSymbol" = '${data.route.toWaypointSymbol}'` : ''}
order by m2."sellPrice" - m1."purchasePrice" desc LIMIT ${data.dbLimit};`
  const startExecute = Date.now();
  const bestTrades = await prisma.$queryRawUnsafe<{
    buySystem: string
    buyKind: string
    buyAt: string
    buySupply: string
    buyActivity: string
    sellSystem: string
    sellKind: string
    sellAt: string
    sellSupply: string
    sellActivity: string
    buyVolume: number
    sellVolume: number
    tradeVolume: number
    dis: number
    disSys: number
    perUnitProfit: number
    tradeGoodSymbol: string
    purchasePrice: number
    sellPrice: number
    since: string
  }[]>(query);
  console.log(`Query took ${Date.now() - startExecute}ms`)

  return Promise.all(bestTrades.map(async trade => {
    const exportsForImport = importToExportMap[trade.tradeGoodSymbol] ?? []
    const suppliedExports = await prisma.marketPrice.findMany({
      select: {
        tradeGoodSymbol: true,
        activityLevel: true,
        tradeVolume: true,
      },
      where: {
        kind: 'EXPORT',
        waypointSymbol: trade.sellAt,
        tradeGoodSymbol: {
          in: exportsForImport
        }
      }
    })
    const safeBuyVolume = [
      'ABUNDANT',
      'HIGH'
    ].includes(trade.buySupply) ? trade.buyVolume * 10 : ['MODERATE'].includes(trade.buySupply) ? trade.buyVolume * 3 : trade.buyVolume;
    const safeSellVolume = [
      'LIMITED',
      'SCARCE'
    ].includes(trade.sellSupply) ? trade.sellVolume * 10 : ['MODERATE'].includes(trade.sellSupply) ? trade.sellVolume * 3 : trade.sellVolume;

    const tradeVolume = Math.min(safeBuyVolume, safeSellVolume)
    const totalProfit = Math.min(tradeVolume, defaultCargoVolume) * trade.perUnitProfit;
    const profitPerDistance = Math.min(defaultCargoVolume, tradeVolume) * trade.perUnitProfit / trade.dis

    let priority = priorityLevels[trade.buySupply] + (4 - priorityLevels[trade.sellSupply])
    // penalize trades where the sale location is restricted due to lack of imports
    if (trade.buyActivity === 'RESTRICTED' && trade.buySupply !== 'ABUNDANT') {
      priority = priority - 4;
    }
    if (trade.sellActivity) {
      // if export is already strong, but missing imports, prioritize it
      const hasStrongExport = suppliedExports.some(e => e.activityLevel === 'STRONG')
      const hasRestrictedExport = suppliedExports.some(e => e.activityLevel === 'RESTRICTED')
      const hasStrongImport = trade.sellActivity === 'STRONG'
      const multiplier = hasStrongExport || hasRestrictedExport ? 2 : 1;
      // static bonus to prioritize higher when import is already ok, but not strong
      priority = priority + activityPriority[trade.sellActivity]*multiplier+((hasStrongExport && !hasStrongImport) ? 2 : 0);
    } else {
      // exchange market get static bonus of 1
      priority = priority + 1;
    }
    if (trade.buyActivity) {
      priority = priority + (3 - activityPriority[trade.buyActivity]);
    } else {
      // exchange market get static bonus of 1
      priority = priority + 1;
    }
    if (trade.buySupply === "SCARCE" && trade.buyKind === 'EXCHANGE') {
      // no pulling blood from a stone
      priority = priority - 4;
    }
    if (trade.tradeGoodSymbol.includes('_ORE')) {
      // static bonus to prioritize basic materials
      priority = priority + 2;
    }
    // this means we're not importing enough components for this export
    // if (trade.buyKind === 'EXPORT' && trade.buyActivity === 'RESTRICTED') {
    //   priority = priority - 2;
    // }

    priority = priority + (profitPerDistance / 30) * moneyImportance;

    priority -= trade.dis / 400;

    return {
      fromWaypointSymbol: trade.buyAt,
      toWaypointSymbol: trade.sellAt,
      tradeSymbol: trade.tradeGoodSymbol as TradeSymbol,
      purchasePrice: trade.purchasePrice,
      sellPrice: trade.sellPrice,
      buyActivity: trade.buyActivity,
      sellActivity: trade.sellActivity,
      buySupply: trade.buySupply,
      sellSupply: trade.sellSupply,
      buyVolume: trade.buyVolume,
      sellVolume: trade.sellVolume,
      reservation: Math.min(trade.sellPrice, Math.round(trade.purchasePrice*1.2)) * defaultCargoVolume,
      unitProfit: trade.perUnitProfit,
      maxProfit: Math.min(defaultCargoVolume, tradeVolume) * trade.perUnitProfit,
      profitPerDistance,
      dis: trade.dis,
      priority: priority,
      amount: tradeVolume,
      totalProfit: totalProfit,
      buyKind: trade.buyKind,
      sellKind: trade.sellKind,
      associatedExports: suppliedExports
    }
  })).then(rows => {
    rows.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority
      return b.profitPerDistance - a.profitPerDistance
    });

    return rows.slice(0, data.resultLimit);
  })
}

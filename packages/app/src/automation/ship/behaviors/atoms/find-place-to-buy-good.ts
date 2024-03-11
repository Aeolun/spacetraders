import {TradeSymbol} from "spacetraders-sdk";
import {getDistance} from "@common/lib/getDistance";

interface SaleLocation {
  waypoint: {
    symbol: string
    systemSymbol: string
    x: number
    y: number
  }
  goods: {
    symbol: TradeSymbol
    quantity: number
    supply: string | undefined
    price: number
    tradeVolume: number
    pricePerUnit: number
  }[]
}

export interface InputSaleLocation {
  tradeGoodSymbol: string
  purchasePrice: number | null
  supply?: string | null
  tradeVolume: number | null
  waypoint: {
    symbol: string
    systemSymbol: string
    x: number
    y: number
  }
}

export async function findPlaceToBuyGood(purchaseLocationsInSystem: InputSaleLocation[], currentWaypoint: {
  symbol: string
  systemSymbol: string
  x: number
  y: number
}, tradeSymbols: Partial<Record<TradeSymbol, number>>): Promise<SaleLocation[]> {
  const purchaseableGoods = Object.keys(tradeSymbols)

  purchaseLocationsInSystem.sort((a, b) => {
    const aDis = getDistance(currentWaypoint, a.waypoint)
    const bDis = getDistance(currentWaypoint, b.waypoint)
    // prefer closest
    if (aDis && bDis && aDis !== bDis) {
      return aDis - bDis
    }
    if (b.purchasePrice && a.purchasePrice) {
      return a.purchasePrice - b.purchasePrice
    }
    return 0
  })

  // group by waypoint.symbol
  const groupedByWaypoint = purchaseLocationsInSystem.reduce((acc, cur) => {
      if (!acc[cur.waypoint.symbol]) {
        acc[cur.waypoint.symbol] = {
          systemSymbol: cur.waypoint.systemSymbol,
          waypoint: {
            symbol: cur.waypoint.symbol,
            systemSymbol: cur.waypoint.systemSymbol,
            x: cur.waypoint.x,
            y: cur.waypoint.y,
          },
          goods: []
        }
      }
      const cargoVolume = tradeSymbols[cur.tradeGoodSymbol as TradeSymbol]
      if (cargoVolume && cargoVolume > 0) {
        acc[cur.waypoint.symbol].goods.push({
          symbol: cur.tradeGoodSymbol as TradeSymbol,
          supply: cur.supply ?? undefined,
          quantity: tradeSymbols[cur.tradeGoodSymbol as TradeSymbol] ?? 0,
          price: (tradeSymbols[cur.tradeGoodSymbol as TradeSymbol] ?? 0) * (cur.purchasePrice ?? 0),
          tradeVolume: cur.tradeVolume ?? 0,
          pricePerUnit: cur.purchasePrice ?? 0
        })
      }
      return acc
    }, {} as Record<string, {
      systemSymbol: string
      waypoint: {
        symbol: string
        systemSymbol: string
        x: number
        y: number
      }
      goods: {
        symbol: TradeSymbol
        quantity: number
        supply: string | undefined
        price: number
        tradeVolume: number
        pricePerUnit: number
      }[]}>
  );

  // sort by waypoints with most goods
  const sortedByMostGoods = Object.values(groupedByWaypoint).sort((a, b) => {
    if(b.goods.length !== a.goods.length) {
      return b.goods.length - a.goods.length
    }
    // distance
    return getDistance(currentWaypoint, a.waypoint) - getDistance(currentWaypoint, b.waypoint)
  })

  if (!sortedByMostGoods.length) {
    return []
  }

  let currentOption = sortedByMostGoods[0]
  const placesToBuy: SaleLocation[] = [currentOption]
  const purchasedGoods = currentOption?.goods.map(good => good.symbol);
  let count = 0;
  while (purchaseableGoods.some(good => !purchasedGoods.includes(good as TradeSymbol)) && count <= 10) {
    // sort the next best option that sells the most things we haven't sold yet
    const nextBestOption = sortedByMostGoods.sort((a, b) => {
      const aUnsold = a.goods.filter(good => !purchasedGoods.includes(good.symbol))
      const bUnsold = b.goods.filter(good => !purchasedGoods.includes(good.symbol))
      if (aUnsold.length !== bUnsold.length) {
        return bUnsold.length - aUnsold.length
      }
      return getDistance(currentOption.waypoint, a.waypoint) - getDistance(currentOption.waypoint, b.waypoint)
    })
    currentOption = nextBestOption[0]
    const thingsNotAlreadyPurchased = currentOption.goods.filter(good => !purchasedGoods.includes(good.symbol))
    placesToBuy.push({
      ...currentOption,
      goods: thingsNotAlreadyPurchased
    })
    purchasedGoods.push(...thingsNotAlreadyPurchased.map(good => good.symbol))
    count++
  }
  if (count === 10) {
    console.error("Couldn't find a place to sell all goods, selling what we can")
  }

  return placesToBuy
}
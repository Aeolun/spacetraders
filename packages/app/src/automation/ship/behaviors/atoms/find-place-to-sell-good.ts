import {Ship} from "@auto/ship/ship";
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
  }[]
}

export interface InputSaleLocation {
  tradeGoodSymbol: string
  sellPrice: number | null
  waypoint: {
    symbol: string
    systemSymbol: string
    x: number
    y: number
  }
}

export async function findPlaceToSellGood(saleLocationsInSameSystem: InputSaleLocation[], currentWaypoint: {
  symbol: string
  systemSymbol: string
  x: number
  y: number
}, tradeSymbols: Partial<Record<TradeSymbol, number>>): Promise<SaleLocation[]> {
  const sellableGoods = Object.keys(tradeSymbols)

  saleLocationsInSameSystem.sort((a, b) => {
    const aDis = getDistance(currentWaypoint, a.waypoint)
    const bDis = getDistance(currentWaypoint, b.waypoint)
    // prefer closest
    if (aDis && bDis && aDis !== bDis) {
      return aDis - bDis
    }
    if (b.sellPrice && a.sellPrice) {
      return b.sellPrice - a.sellPrice
    }
    return 0
  })

  // group by waypoint.symbol
  const groupedByWaypoint = saleLocationsInSameSystem.reduce((acc, cur) => {
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
        quantity: tradeSymbols[cur.tradeGoodSymbol as TradeSymbol] ?? 0,
        price: (tradeSymbols[cur.tradeGoodSymbol as TradeSymbol] ?? 0) * (cur.sellPrice ?? 0)
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
      price: number
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
  const placesToSell: SaleLocation[] = [currentOption]
  const soldGoods = currentOption?.goods.map(good => good.symbol);
  let count = 0;
  while (sellableGoods.some(good => !soldGoods.includes(good as TradeSymbol)) && count <= 10) {
    // sort the next best option that sells the most things we haven't sold yet
    const nextBestOption = sortedByMostGoods.sort((a, b) => {
      const aUnsold = a.goods.filter(good => !soldGoods.includes(good.symbol))
      const bUnsold = b.goods.filter(good => !soldGoods.includes(good.symbol))
      if (aUnsold.length !== bUnsold.length) {
        return bUnsold.length - aUnsold.length
      }
      return getDistance(currentOption.waypoint, a.waypoint) - getDistance(currentOption.waypoint, b.waypoint)
    })
    currentOption = nextBestOption[0]
    const thingsNotAlreadySold = currentOption.goods.filter(good => !soldGoods.includes(good.symbol))
    placesToSell.push({
      ...currentOption,
      goods: thingsNotAlreadySold
    })
    soldGoods.push(...thingsNotAlreadySold.map(good => good.symbol))
    count++
  }
  if (count == 10) {
    console.error("Couldn't find a place to sell all goods, selling what we can")
  }

  return placesToSell
}
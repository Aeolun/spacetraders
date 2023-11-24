import {Ship} from "@auto/ship/ship";
import {TradeSymbol} from "spacetraders-sdk";
import {prisma} from "@common/prisma";
import {getDistance} from "@common/lib/getDistance";

export async function findPlaceToSellGood(ship: Ship, tradeSymbol: TradeSymbol) {
  const saleLocationsInSameSystem = await prisma.marketPrice.findMany({
    where: {
      tradeGoodSymbol: tradeSymbol,
      waypoint: {
        system: {
          symbol: ship.currentSystemSymbol
        }
      }
    },
    include: {
      waypoint: true,
    },
    orderBy: {
      sellPrice: 'desc'
    }
  })

  saleLocationsInSameSystem.sort((a, b) => {
    const aDis = getDistance(ship.currentWaypoint, a.waypoint)
    const bDis = getDistance(ship.currentWaypoint, b.waypoint)
    if (aDis !== bDis) return aDis - bDis
    if (b.sellPrice && a.sellPrice) {
      return b.sellPrice - a.sellPrice
    }
    return 0
  })

  return saleLocationsInSameSystem[0]?.waypoint
}
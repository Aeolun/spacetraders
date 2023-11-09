import {Ship} from "@auto/ship/ship";
import {TradeSymbol} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function findPlaceToSellGood(ship: Ship, tradeSymbol: TradeSymbol) {
  const saleLocationsInSameSystem = await prisma.marketPrice.findFirst({
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

  return saleLocationsInSameSystem?.waypoint
}
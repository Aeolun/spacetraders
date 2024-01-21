import {prisma} from "@common/prisma";

export const queryMarketToBuy = (tradeGoodSymbols: string[], currentSystemSymbol: string) => {
  return prisma.marketPrice.findMany({
    where: {
      tradeGoodSymbol: {
        in: tradeGoodSymbols
      },
      waypoint: {
        system: {
          symbol: currentSystemSymbol
        }
      }
    },
    include: {
      waypoint: true,
    },
    orderBy: {
      purchasePrice: 'desc'
    }
  })
}
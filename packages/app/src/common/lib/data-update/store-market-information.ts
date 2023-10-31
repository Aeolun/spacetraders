import {GetMarket200Response, TradeSymbol} from "spacetraders-sdk";
import {prisma, Prisma} from "@common/prisma";

export async function storeMarketInformation(data: GetMarket200Response) {
  let hasFuel = false

  const marketData: Prisma.MarketPriceUncheckedCreateInput[] = []
  data.data.tradeGoods?.forEach(good => {
    if (good.symbol === 'FUEL') {
      hasFuel = true
    }

    marketData.push({
      tradeGoodSymbol: good.symbol,
      kind: good.type,
      waypointSymbol: data.data.symbol,
      sellPrice: good.sellPrice,
      purchasePrice: good.purchasePrice,
      tradeVolume: good.tradeVolume,
      supply: good.supply
    })
  })

  if (hasFuel) {
    const waypoint = await prisma.waypoint.findFirstOrThrow({
      where: {
        symbol: data.data.symbol
      }
    })
    await prisma.system.update({
      where: {
        symbol: waypoint.systemSymbol
      },
      data: {
        hasFuel: true
      }
    })
  }
  const existingGoods = await prisma.tradeGood.findMany({
    where: {
      symbol: {
        in: marketData.map(good => good.tradeGoodSymbol)
      }
    }
  })
  await Promise.all(marketData.map(async data => {
    if (!existingGoods.find(good => good.symbol === data.tradeGoodSymbol && good.symbol !== good.name)) {
      await prisma.tradeGood.upsert({
        where: {
          symbol: data.tradeGoodSymbol
        },
        create: {
          symbol: data.tradeGoodSymbol,
          name: data.tradeGoodSymbol,
          description: data.tradeGoodSymbol
        },
        update: {
          name: data.tradeGoodSymbol,
          description: data.tradeGoodSymbol
        }
      })
    }
    return prisma.marketPrice.upsert({
      where: {
        waypointSymbol_tradeGoodSymbol: {
          waypointSymbol: data.waypointSymbol,
          tradeGoodSymbol: data.tradeGoodSymbol
        }
      },
      create: data,
      update: {
        sellPrice: data.sellPrice,
        purchasePrice: data.purchasePrice,
        tradeVolume: data.tradeVolume,
        supply: data.supply
      }
    })
  }))

  console.log(`Data stored for ${marketData.length} items in ${data.data.symbol}`)
}
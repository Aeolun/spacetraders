import {prisma, Prisma} from "@common/prisma";
import {combinedMarketStats} from "@common/lib/stats/market-stats";

export async function updateMarketStats() {
  const allMarketData = await prisma.marketPrice.findMany({})

  const combinedData = combinedMarketStats(allMarketData);

  const rows: Prisma.ConsolidatedPriceCreateManyInput[] = []
  combinedData.map(data => {
    rows.push({
      tradeGoodSymbol: data.tradeGoodSymbol,
      purchaseMaxPrice: data.purchase.maxPrice,
      purchaseMinPrice: data.purchase.minPrice,
      purchaseMedianPrice: data.purchase.medianPrice,
      purchaseAvgPrice: data.purchase.averagePrice,
      purchaseStdDev: data.purchase.standardDeviation,
      purchaseP95: data.purchase.p95,
      purchaseP5: data.purchase.p5,
      sellMaxPrice: data.sale.maxPrice,
      sellMinPrice: data.sale.minPrice,
      sellMedianPrice: data.sale.medianPrice,
      sellAvgPrice: data.sale.averagePrice,
      sellStdDev: data.sale.standardDeviation,
      sellP95: data.sale.p95,
      sellP5: data.sale.p5,
      maxVolume: data.maxVolume,
      minVolume: data.minVolume,
      importMarketCount: data.import,
      exportMarketCount: data.export,
      exchangeMarketCount: data.exchange,
    })
  })

  await prisma.$transaction(async prisma => {
    await prisma.consolidatedPrice.deleteMany();
    await prisma.consolidatedPrice.createMany({
      data: rows
    })
  })
}
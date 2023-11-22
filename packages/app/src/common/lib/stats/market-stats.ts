import {MarketPrice} from "../st-universe/src/universe/formulas/trade";
import {TradeSymbol} from "spacetraders-sdk";

function median(values: number[]) {
  if (values.length == 0) return 0;
  values.sort(function (a, b) {
    return a - b;
  })
  var half = Math.floor(values.length / 2);
  if (values.length % 2)
    return values[half];
  return (values[half - 1] + values[half]) / 2.0;
}

function average(data: number[]) {
  return data.reduce((a, b) => a + b, 0) / data.length;
}

function standardDeviation(values: number[]) {
  const avg = average(values);

  const squareDiffs = values.map(function (value) {
    const diff = value - avg;
    return diff * diff;
  });

  const avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
}

function percentile(values: number[], percentile: number) {
  values.sort((a, b) => a - b)
  const index = (percentile / 100) * values.length;
  let result;
  if (Math.floor(index) === index) {
    result = (values[(index - 1)] + values[index]) / 2;
  } else {
    result = values[Math.floor(index)];
  }
  return result;
}

export function combinedMarketStats(tradeGood: MarketPrice[]) {
  const rows: {
    tradeGoodSymbol: TradeSymbol
    purchase: {
      maxPrice: number
      minPrice: number
      medianPrice: number
      averagePrice: number
      standardDeviation: number
      p95: number
      p5: number
    }
    sale: {
      maxPrice: number
      minPrice: number
      medianPrice: number
      averagePrice: number
      standardDeviation: number
      p95: number
      p5: number
    }
    maxVolume: number
    minVolume: number
    import: number
    export: number
    exchange: number
  }[] = []

  const tradeGoodMap: Record<string, MarketPrice[]> = {}
  tradeGood.forEach(tg => {
    if (!tradeGoodMap[tg.tradeGoodSymbol]) {
      tradeGoodMap[tg.tradeGoodSymbol] = []
    }
    tradeGoodMap[tg.tradeGoodSymbol].push(tg)
  })

  Object.keys(tradeGoodMap).forEach(tg => {
    const purchasePrices = tradeGoodMap[tg].filter(t => t.purchasePrice > 0).map(t => t.purchasePrice)
    const salePrices = tradeGoodMap[tg].filter(t => t.sellPrice > 0).map(t => t.sellPrice)
    const volumes = tradeGoodMap[tg].filter(t => t.tradeVolume > 0).map(t => t.tradeVolume)
    rows.push({
      tradeGoodSymbol: tg as TradeSymbol,
      purchase: {
        maxPrice: Math.max(...purchasePrices),
        minPrice: Math.min(...purchasePrices),
        medianPrice: median(purchasePrices),
        averagePrice: average(purchasePrices),
        standardDeviation: standardDeviation(purchasePrices),
        p95: percentile(purchasePrices, 95),
        p5: percentile(purchasePrices, 5),
      },
      sale: {
        maxPrice: Math.max(...salePrices),
        minPrice: Math.min(...salePrices),
        medianPrice: median(salePrices),
        averagePrice: average(salePrices),
        standardDeviation: standardDeviation(salePrices),
        p95: percentile(salePrices, 95),
        p5: percentile(salePrices, 5),
      },
      maxVolume: Math.max(...volumes),
      minVolume: Math.min(...volumes),
      import: tradeGoodMap[tg].filter(t => t.kind === 'IMPORT').length,
      export: tradeGoodMap[tg].filter(t => t.kind === 'EXPORT').length,
      exchange: tradeGoodMap[tg].filter(t => t.kind === 'EXCHANGE').length,
    })
  })

  return rows;
}
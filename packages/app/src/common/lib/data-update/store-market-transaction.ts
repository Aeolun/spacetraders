import {MarketTransaction, ShipyardTransaction} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function storeMarketTransaction(transaction: MarketTransaction | ShipyardTransaction) {
  if ('tradeSymbol' in transaction) {
    await prisma.marketTransaction.upsert({
      where: {
        waypointSymbol_shipSymbol_tradeSymbol_timestamp: {
          waypointSymbol: transaction.waypointSymbol,
          shipSymbol: transaction.shipSymbol,
          tradeSymbol: transaction.tradeSymbol,
          timestamp: transaction.timestamp
        }
      },
      create: {
        waypointSymbol: transaction.waypointSymbol,
        shipSymbol: transaction.shipSymbol,
        tradeSymbol: transaction.tradeSymbol,
        units: transaction.units,
        pricePerUnit: transaction.pricePerUnit,
        totalPrice: transaction.totalPrice,
        type: transaction.type,
        timestamp: transaction.timestamp
      },
      update: {}
    })
  } else {
    await prisma.marketTransaction.upsert({
      where: {
        waypointSymbol_shipSymbol_tradeSymbol_timestamp: {
          waypointSymbol: transaction.waypointSymbol,
          shipSymbol: transaction.shipSymbol,
          tradeSymbol: transaction.shipSymbol,
          timestamp: transaction.timestamp
        }
      },
      create: {
        waypointSymbol: transaction.waypointSymbol,
        shipSymbol: transaction.shipSymbol,
        tradeSymbol: transaction.shipSymbol,
        units: 1,
        pricePerUnit: transaction.price,
        totalPrice: transaction.price,
        type: 'PURCHASE',
        timestamp: transaction.timestamp
      },
      update: {}
    })
  }
}
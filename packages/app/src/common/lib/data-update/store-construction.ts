import {GetConstruction200Response, ShipCargo} from "spacetraders-sdk";
import {prisma} from "@common/prisma";
import {returnShipData} from "@auto/ship/updateShips";

export async function processConstruction(data: GetConstruction200Response) {
  return prisma.construction.upsert({
    where: {
      symbol: data.data.symbol,
    },
    create: {
      symbol: data.data.symbol,
      isCompleted: data.data.isComplete,
      materials: {
        create: data.data.materials.map((material) => {
          return {
            tradeGoodSymbol: material.tradeSymbol,
            fulfilled: material.fulfilled,
            required: material.required,
          }
        }),
      }
    },
    update: {
      isCompleted: data.data.isComplete,
      materials: {
        upsert: data.data.materials.map((material) => {
          return {
            where: {
              constructionId_tradeGoodSymbol: {
                constructionId: data.data.symbol,
                tradeGoodSymbol: material.tradeSymbol,
              }
            },
            create: {
              tradeGoodSymbol: material.tradeSymbol,
              fulfilled: material.fulfilled,
              required: material.required,
            },
            update: {
              fulfilled: material.fulfilled,
            }
          }
        })
      }
    }
  })
}
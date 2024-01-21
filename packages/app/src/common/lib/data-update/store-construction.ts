import {GetConstruction200Response, ShipCargo} from "spacetraders-sdk";
import {prisma} from "@common/prisma";
import {returnShipData} from "@auto/ship/getAllShips";

export async function processConstruction(data: GetConstruction200Response['data']) {
  await prisma.waypoint.update({
    where: {
      symbol: data.symbol,
    },
    data: {
      isUnderConstruction: !data.isComplete,
    }
  });
  return prisma.construction.upsert({
    where: {
      symbol: data.symbol,
    },
    create: {
      symbol: data.symbol,
      isCompleted: data.isComplete,
      materials: {
        create: data.materials.map((material) => {
          return {
            tradeGoodSymbol: material.tradeSymbol,
            fulfilled: material.fulfilled,
            required: material.required,
          }
        }),
      }
    },
    update: {
      isCompleted: data.isComplete,
      materials: {
        upsert: data.materials.map((material) => {
          return {
            where: {
              constructionId_tradeGoodSymbol: {
                constructionId: data.symbol,
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
import {GetJumpGate200Response} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function storeJumpGateInformation(systemSymbol: string, waypointSymbol: string, data: GetJumpGate200Response) {
  await prisma.system.update({
    where: {
      symbol: systemSymbol
    },
    data: {
      hasJumpGate: true,
      jumpgateRange: data.data.jumpRange
    }
  })
  console.log('save jump infomration', systemSymbol, data.data.jumpRange)

  await prisma.jumpgate.upsert({
    where: {
      waypointSymbol: waypointSymbol
    },
    create: {
      waypointSymbol: waypointSymbol,
      range: data.data.jumpRange
    },
    update: {
      range: data.data.jumpRange
    }
  })

  await Promise.all(data.data.connectedSystems.map(system => {
    return prisma.jumpConnectedSystem.upsert({
      where: {
        fromWaypointSymbol_toWaypointSymbol: {
          fromWaypointSymbol: waypointSymbol,
          toWaypointSymbol: system.symbol
        }
      },
      create: {
        fromWaypointSymbol: waypointSymbol,
        toWaypointSymbol: system.symbol,
        distance: system.distance,
        x: system.x,
        y: system.y,
      },
      update: {
        distance: system.distance,
        x: system.x,
        y: system.y,
      }
    })
  }))
}
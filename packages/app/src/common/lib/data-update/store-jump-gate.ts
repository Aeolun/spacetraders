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
  
  await prisma.waypoint.update({
    where: {
      symbol: waypointSymbol
    },
    data: {
      jumpConnectedTo: {
        connect: data.data.connectedSystems.map(system => {
          return {
            symbol: system.symbol
          }
        })
      }
    }
  });
}
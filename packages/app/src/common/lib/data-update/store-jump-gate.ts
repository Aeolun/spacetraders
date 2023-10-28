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


  const jumpgateWaypoints = await prisma.waypoint.findMany({
    select: {
      symbol: true,
      systemSymbol: true,
    },
    where: {
      systemSymbol: {
        in: data.data.connectedSystems.map(system => system.symbol)
      },
      type: 'JUMP_GATE'
    }
  })
  await prisma.$transaction(async prisma => {
    await prisma.jumpConnectedSystem.deleteMany({
      where: {
        fromWaypointSymbol: waypointSymbol,
      }
    });
    await prisma.jumpConnectedSystem.createMany({
      data: data.data.connectedSystems.map(system => {
        return {
          fromWaypointSymbol: waypointSymbol,
          fromSystemSymbol: systemSymbol,
          toWaypointSymbol: jumpgateWaypoints.find(wp => wp.systemSymbol === system.symbol)?.symbol,
          toSystemSymbol: system.symbol,
          distance: system.distance,
          x: system.x,
          y: system.y,
        }
      })
    })
  })
}
import {Cooldown} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function processCooldown(shipSymbol: string, cooldown: Cooldown) {
  return await prisma.ship.update({
    where: {
      symbol: shipSymbol,
    },
    include: {
      currentWaypoint: true,
      destinationWaypoint: true,
      departureWaypoint: true,
      frame: true,
      reactor: true,
      engine: true,
      mounts: true,
      modules: true,
    },
    data: {
      reactorCooldownOn: cooldown.expiration,
    },
  });
}
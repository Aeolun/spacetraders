import {ShipFuel} from "spacetraders-sdk";
import {prisma} from "@auto/prisma";

export async function processFuel(shipSymbol: string, fuel: ShipFuel) {
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
      cargo: true,
    },
    data: {
      fuelCapacity: fuel.capacity,
      fuelAvailable: fuel.current,
    },
  });
}
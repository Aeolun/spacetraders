import {APIInstance} from "@auto/lib/createApi";
import {prisma} from "@auto/prisma";
import {processShip} from "@auto/ship/data-update/store-ship";

export async function updateShips(api: APIInstance) {
  const ships = await api.fleet.getMyShips(1, 20);
  await Promise.all(
    ships.data.data.map(async (ship) => {
      return processShip(ship);
    })
  );
  const totalPages = Math.ceil(ships.data.meta.total / 20);
  if (totalPages > 1) {
    for (let i = 2; i < totalPages; i++) {
      const moreShips = await api.fleet.getMyShips(i, 20);
      await Promise.all(
        moreShips.data.data.map(async (ship) => {
          return processShip(ship);
        })
      );
    }
  }
}

export async function returnShipData(shipSymbol: string) {
  return prisma.ship.findFirst({
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
  });
}

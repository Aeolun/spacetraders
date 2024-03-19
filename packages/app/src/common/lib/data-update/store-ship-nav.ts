import {ShipNav} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function processNav(shipSymbol: string, nav: ShipNav) {
  const shipData = {
    currentSystemSymbol: nav.systemSymbol,
    currentWaypointSymbol: nav.waypointSymbol,

    destinationWaypointSymbol: nav.route.destination.symbol,
    departureWaypointSymbol: nav.route.origin.symbol,
    departureOn: nav.route.departureTime,
    arrivalOn: nav.route.arrival,

    navStatus: nav.status,
    flightMode: nav.flightMode,
  };
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
      shipTasks: true,
    },
    data: shipData,
  });
}
import {Ship} from "@auto/ship/ship";
import {prisma, System, ExploreStatus} from "@common/prisma";
import {findFastestPath} from "@common/lib/find-fastest-path";

export async function getExplorableWaypointsInOrder(ship: Ship, system: System) {
  const explorableWaypoints = await prisma.waypoint.findMany({
    where: {
      systemSymbol: system.symbol,
      exploreStatus: ExploreStatus.UNEXPLORED,
    }
  });

  if (explorableWaypoints.length === 0) {
    return [];
  }

  const bestRoute = await findFastestPath(explorableWaypoints.map(w => ({
    name: w.symbol,
    x: w.x,
    y: w.y,
  })), ship.currentWaypointSymbol)

  return bestRoute.path.map((wp) => {
    const newWp = explorableWaypoints.find((w) => w.symbol === wp);
    if (!newWp) {
      throw new Error(`Waypoint ${wp} not found in system ${system.symbol}`);
    }
    return newWp;
  });
}
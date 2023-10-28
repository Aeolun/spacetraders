import {Ship} from "@auto/ship/ship";
import {prisma, System} from "@common/prisma";
import {findFastestPath} from "@common/lib/find-fastest-path";

export async function getExplorableWaypointsInOrder(ship: Ship, system: System) {
  const systemInfo = await ship.getSystemWaypoints(system.symbol);
  const unchartedWaypoints = systemInfo.filter((wp) => {
    return wp.traits.some((trait) => trait.symbol === "UNCHARTED");
  });

  if (unchartedWaypoints.length <= 0) {
    await prisma.system.update({
      where: {
        symbol: system.symbol,
      },
      data: {
        hasUncharted: false,
      },
    });
    throw new Error(`No uncharted waypoints in ${system.symbol}`)
  }

  const bestRoute = await findFastestPath(unchartedWaypoints.map(w => ({
    name: w.symbol,
    x: w.x,
    y: w.y,
  })), ship.currentWaypointSymbol)

  return bestRoute.path.map((wp) => {
    return unchartedWaypoints.find((w) => w.symbol === wp);
  });
}
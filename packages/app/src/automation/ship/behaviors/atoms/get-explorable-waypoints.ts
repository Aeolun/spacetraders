import {Ship} from "@auto/ship/ship";
import {prisma, System} from "@common/prisma";
import {getDistance} from "@common/lib/getDistance";

export async function getExplorableWaypoints(ship: Ship, system: System) {
  const systemInfo = await ship.getSystemWaypoints(system.symbol);
  const hasUnchartedTraits = systemInfo.some((wp) => {
    return wp.traits.some((trait) => trait.symbol === "UNCHARTED");
  });

  if (!hasUnchartedTraits) {
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

  systemInfo.map((wp) => {
    wp.distance = getDistance(wp, shipData.currentWaypoint);
  });
  systemInfo.sort((a, b) => {
    return a.distance > b.distance ? 1 : -1;
  });
}
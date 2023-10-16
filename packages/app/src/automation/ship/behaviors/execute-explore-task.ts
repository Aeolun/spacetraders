import { Ship } from "@auto/ship/ship";
import { prisma, Prisma } from "@auto/prisma";
import { travelBehavior } from "@auto/ship/behaviors/travel-behavior";
import { getDistance } from "@common/lib/getDistance";
import { defaultWayfinder } from "@auto/wayfinding";
import { checkIfNeedDriftForFuel } from "./atoms/check-if-need-drift-for-fuel";
import {findSystemToExplore} from "@auto/ship/behaviors/atoms/find-system-to-explore";
import {ExploreTask} from "@auto/task/explore-task";
import {storeWaypoint} from "@auto/ship/data-update/store-waypoint";
import {exploreWaypoint} from "@auto/ship/behaviors/atoms/explore-waypoint";

export const executeExploreTask = async (
  ship: Ship,
  task: ExploreTask
) => {
  await checkIfNeedDriftForFuel(ship);

  const route = await findRouteTo(ship, explorableSystem);

  const systemInfo = await ship.getSystemWaypoints(task.system.symbol);
  const hasUnchartedTraits = systemInfo.some((wp) => {
    return wp.traits.some((trait) => trait.symbol === "UNCHARTED");
  });

  if (!hasUnchartedTraits) {
    ship.log(
      `${task.system.symbol} has no more uncharted waypoints, task complete.`
    );
    await prisma.system.update({
      where: {
        symbol: task.system.symbol,
      },
      data: {
        hasUncharted: false,
      },
    });
    return;
  }

  do {
    const shipData = await prisma.ship.findFirstOrThrow({
      where: {
        symbol: ship.symbol,
      },
      include: {
        currentWaypoint: true,
      },
    });
    explorableWaypoints.forEach((wp) => {
      wp.distance = getDistance(wp, shipData.currentWaypoint);
    });
    explorableWaypoints.sort((a, b) => {
      return a.distance > b.distance ? 1 : -1;
    });

    // closest waypoint
    const wp = explorableWaypoints[0];

    await ship.navigate(wp.symbol);
    await exploreWaypoint(ship);

    explorableWaypoints = (await prisma.waypoint.findMany({
      where: {
        systemSymbol: exploreSystem.symbol,
        traits: {
          some: {
            symbol: "UNCHARTED",
          },
        },
      },
    })).map(i => ({
      ...i,
      distance: undefined
    }));
  } while (explorableWaypoints.length > 0);

  ship.log(`Finished exploring ${exploreSystem.symbol}`);
  exploreTaken.delete(exploreSystem.symbol);
  await ship.setOverallGoal(null);
};

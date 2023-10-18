import { Ship } from "@auto/ship/ship";
import { prisma, Prisma } from "@common/prisma";
import { getDistance } from "@common/lib/getDistance";
import { checkIfNeedDriftForFuel } from "./atoms/check-if-need-drift-for-fuel";
import {ExploreTask} from "@auto/task/explore-task";
import {exploreWaypoint} from "@auto/ship/behaviors/atoms/explore-waypoint";
import {findRouteTo} from "@auto/ship/behaviors/atoms/find-route-to";
import {travelRoute} from "@auto/ship/behaviors/atoms/travel-route";
import {getExplorableWaypoints} from "@auto/ship/behaviors/atoms/get-explorable-waypoints";

export const executeExploreTask = async (
  ship: Ship,
  task: ExploreTask
) => {
  await checkIfNeedDriftForFuel(ship);

  const explorableWaypoints = await getExplorableWaypoints(ship, task.system)

  const route = await findRouteTo(ship, task.system);
  await travelRoute(ship, route);

  do {


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

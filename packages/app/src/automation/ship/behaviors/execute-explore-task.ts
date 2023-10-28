import { Ship } from "@auto/ship/ship";
import {ExploreTask} from "@auto/task/explore-task";
import {exploreWaypoint} from "@auto/ship/behaviors/atoms/explore-waypoint";
import {findRouteTo} from "@auto/ship/behaviors/atoms/find-route-to";
import {travelRoute} from "@auto/ship/behaviors/atoms/travel-route";
import {getExplorableWaypointsInOrder} from "@auto/ship/behaviors/atoms/get-explorable-waypoints-in-order";

export const executeExploreTask = async (
  ship: Ship,
  task: ExploreTask
) => {
  const explorableWaypoints = await getExplorableWaypointsInOrder(ship, task.system)

  const route = await findRouteTo(ship, task.system);
  await travelRoute(ship, route);

  do {
    // closest waypoint
    const wp = explorableWaypoints.shift();

    await ship.navigate(wp.symbol);
    await exploreWaypoint(ship);
  } while (explorableWaypoints.length > 0);

  ship.log(`Finished exploring ${task.system.symbol}`);
};

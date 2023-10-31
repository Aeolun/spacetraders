import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { System } from '@common/prisma'
import {Ship} from "@auto/ship/ship";
import {getExplorableWaypointsInOrder} from "@auto/ship/behaviors/atoms/get-explorable-waypoints-in-order";

export class ExploreObjective extends AbstractObjective {
  public system: System
  type: ObjectiveType.EXPLORE = ObjectiveType.EXPLORE;

  constructor(system: System) {
    super(`Explore ${system.symbol}`);
    this.system = system;
  }

  async constructTasks(ship: Ship) {
    if (ship.currentSystemSymbol != this.system.symbol) {
      // add tasks to travel to target system
    }

    // add tasks to explore all waypoints
    const orderedWaypoints = await getExplorableWaypointsInOrder(ship, this.system)

    
  }
}
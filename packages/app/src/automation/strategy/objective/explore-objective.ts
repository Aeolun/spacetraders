import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { System, prisma, ExploreStatus } from '@common/prisma'
import {Ship} from "@auto/ship/ship";
import {getExplorableWaypointsInOrder} from "@auto/ship/behaviors/atoms/get-explorable-waypoints-in-order";
import {TravelTask} from "@auto/ship/task/travel";
import {ExploreTask} from "@auto/ship/task/explore";
import {getDistance} from "@common/lib/getDistance";

export class ExploreObjective extends AbstractObjective {
  public system: System
  type: ObjectiveType.EXPLORE = ObjectiveType.EXPLORE;

  constructor(system: System) {
    super(`Explore ${system.symbol}`);
    this.system = system;
  }

  appropriateForShip(ship: Ship): boolean {
    return ship.engineSpeed > 10
  }

  distanceToStart(ship: Ship): number {
    return getDistance(ship.currentSystem, this.system);
  }

  async onStarted(ship: Ship) {
    // mark system as being explored
    prisma.system.update({
      where: {
        symbol: this.system.symbol
      },
      data: {
        exploreStatus: ExploreStatus.EXPLORING
      }
    })
  }

  async constructTasks(ship: Ship) {
    if (ship.currentSystemSymbol != this.system.symbol) {
      // add tasks to travel to target system
    }

    // add tasks to explore all waypoints
    const orderedWaypoints = await getExplorableWaypointsInOrder(ship, this.system)

    if (orderedWaypoints.length === 0) {
      await prisma.system.update({
        where: {
          symbol: this.system.symbol,
        },
        data: {
          exploreStatus: ExploreStatus.EXPLORED,
        },
      });
      return;
    }

    for (const waypoint of orderedWaypoints) {
      ship.taskQueue.push(new TravelTask({
        systemSymbol: waypoint.systemSymbol,
        waypointSymbol: waypoint.symbol,
      }))
      ship.taskQueue.push(new ExploreTask(waypoint.symbol))
    }
  }

  async onCompleted(ship: Ship) {
    // mark system as explored
    prisma.system.update({
      where: {
        symbol: this.system.symbol
      },
      data: {
        exploreStatus: ExploreStatus.EXPLORED
      }
    })
  }
}
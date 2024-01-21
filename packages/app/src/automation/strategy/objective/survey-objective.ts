import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {prisma, System, Waypoint} from "@common/prisma";
import {MineTask} from "@auto/ship/task/mine";
import {getDistance} from "@common/lib/getDistance";
import {SurveyTask} from "@auto/ship/task/survey";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {craftTravelTasks} from "@auto/ship/behaviors/atoms/craft-travel-tasks";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export class SurveyObjective extends AbstractObjective {
  type: ObjectiveType.SURVEY = ObjectiveType.SURVEY;
  priority = 0
  isPersistent = true;
  maxShips = 2;
  startingLocation: LocationWithWaypointSpecifier

  constructor(system: System, waypoint: Waypoint, priority?: number) {
    const location = {
      system: {
        symbol: system.symbol,
        x: system.x,
        y: system.y,
      },
      waypoint: {
        symbol: waypoint.symbol,
        x: waypoint.x,
        y: waypoint.y,
      }
    }
    super(`Survey ${waypoint.symbol}`, location);
    this.startingLocation = location;
    if (priority) {
      this.priority = priority;
    }
  }

  async onStarted(ship: Ship, executionId: string): Promise<void> {}
  async onCompleted(ship: Ship, executionId: string): Promise<void> {}
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {}

  appropriateFor(ship: Ship): boolean {
    return ship.hasSurveyor && ship.maxCargo < 40;
  }

  async constructTasks(ship: Ship): Promise<void> {
    const currentLocation = await waypointLocationFromSymbol(ship.currentWaypointSymbol)
    const travelTasks = await craftTravelTasks(currentLocation, this.startingLocation, {
      speed: ship.engineSpeed,
      maxFuel: ship.maxFuel,
      currentFuel: ship.fuel,
    })
    for(const task of travelTasks) {
      await ship.addTask(task)
    }
    await ship.addTask(new SurveyTask(this.startingLocation, 10))

  }
}
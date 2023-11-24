import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {prisma, Waypoint} from "@common/prisma";
import {MineTask} from "@auto/ship/task/mine";
import {getDistance} from "@common/lib/getDistance";
import {SurveyTask} from "@auto/ship/task/survey";

export class SurveyObjective extends AbstractObjective {
  type: ObjectiveType.SURVEY = ObjectiveType.SURVEY;
  priority = 0
  isPersistent = true;
  maxShips = 2;
  waypoint: Waypoint;

  constructor(waypoint: Waypoint, priority?: number) {
    super(`Survey ${waypoint.symbol}`);
    this.waypoint = waypoint;
    if (priority) {
      this.priority = priority;
    }
  }

  async onStarted(ship: Ship): Promise<void> {

  }


  async onCompleted(ship: Ship): Promise<void> {

  }

  appropriateForShip(ship: Ship): boolean {
    return ship.hasSurveyor;
  }

  distanceToStart(ship: Ship): number {
    return getDistance(ship.currentWaypoint, this.waypoint)
  }

  async constructTasks(ship: Ship): Promise<void> {
    await ship.addTask(new TravelTask({
      systemSymbol: this.waypoint.systemSymbol,
      waypointSymbol: this.waypoint.symbol,
    }))
    await ship.addTask(new SurveyTask({
      systemSymbol: this.waypoint.systemSymbol,
      waypointSymbol: this.waypoint.symbol,
    }, 10))

  }
}
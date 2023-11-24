import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {prisma, Waypoint} from "@common/prisma";
import {MineTask} from "@auto/ship/task/mine";
import {getDistance} from "@common/lib/getDistance";
import {SiphonTask} from "@auto/ship/task/siphon";

export class SiphonObjective extends AbstractObjective {
  type: ObjectiveType.SIPHON = ObjectiveType.SIPHON;
  priority = 0
  isPersistent = true;
  maxShips = 8;
  waypoint: Waypoint;

  constructor(waypoint: Waypoint, priority?: number) {
    super(`Siphon ${waypoint.symbol}`);
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
    return ship.hasSiphon;
  }

  distanceToStart(ship: Ship): number {
    return getDistance(ship.currentWaypoint, this.waypoint)
  }

  async constructTasks(ship: Ship): Promise<void> {
    await ship.addTask(new TravelTask({
      systemSymbol: this.waypoint.systemSymbol,
      waypointSymbol: this.waypoint.symbol,
    }))
    await ship.addTask(new SiphonTask({
      systemSymbol: this.waypoint.systemSymbol,
      waypointSymbol: this.waypoint.symbol,
    }, 50))

  }
}
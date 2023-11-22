import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {prisma, Waypoint} from "@common/prisma";
import {MineTask} from "@auto/ship/task/mine";
import {getDistance} from "@common/lib/getDistance";

export class MineObjective extends AbstractObjective {
  type: ObjectiveType.MINE = ObjectiveType.MINE;
  priority = 0
  isPersistent = true;
  maxShips = 8;
  waypoint: Waypoint;
  tradeSymbol?: TradeSymbol;

  constructor(waypoint: Waypoint, tradeSymbol?: TradeSymbol) {
    super(`Mine ${waypoint.symbol}${tradeSymbol ? ` for ${tradeSymbol}` : ''}`);
    this.waypoint = waypoint;
    this.tradeSymbol = tradeSymbol;
  }

  async onStarted(ship: Ship): Promise<void> {

  }


  async onCompleted(ship: Ship): Promise<void> {

  }

  appropriateForShip(ship: Ship): boolean {
    return ship.hasExtractor;
  }

  distanceToStart(ship: Ship): number {
    return getDistance(ship.currentWaypoint, this.waypoint)
  }

  async constructTasks(ship: Ship): Promise<void> {
    await ship.addTask(new TravelTask({
      systemSymbol: this.waypoint.systemSymbol,
      waypointSymbol: this.waypoint.symbol,
    }))
    await ship.addTask(new MineTask({
      systemSymbol: this.waypoint.systemSymbol,
      waypointSymbol: this.waypoint.symbol,
    }, 50))

  }
}
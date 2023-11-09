import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { System, Waypoint } from '@common/prisma'
import {undefined} from "zod";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {UpdateMarketTask} from "@auto/ship/task/update-market";
import {getDistance} from "@common/lib/getDistance";

export class UpdateMarketDataObjective extends AbstractObjective {
  public system: System
  public waypoint: Waypoint

  type: ObjectiveType.UPDATE_MARKET = ObjectiveType.UPDATE_MARKET;

  constructor(system: System, waypoint: Waypoint) {
    super(`Update market data for ${waypoint.symbol}`);
    this.system = system;
    this.waypoint = waypoint;
  }

  appropriateForShip(ship: Ship): boolean {
    return ship.maxCargo === 0;
  }

  distanceToStart(ship: Ship): number {
    return this.system.symbol !== ship.currentSystem.symbol ? 5000 : getDistance(ship.currentWaypoint, this.waypoint)
  }

  async onStarted(ship: Ship) {

  }

  async onCompleted(ship: Ship) {

  }

  async constructTasks(ship: Ship) {
    await ship.addTask(new TravelTask({
      systemSymbol: this.system.symbol,
      waypointSymbol: this.waypoint.symbol,
    }))
    await ship.addTask(new UpdateMarketTask(this.waypoint.symbol))
  }
}
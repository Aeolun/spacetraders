import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {prisma, System, Waypoint} from '@common/prisma'
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {UpdateMarketTask} from "@auto/ship/task/update-market";
import {getDistance} from "@common/lib/getDistance";

export class UpdateMarketDataObjective extends AbstractObjective {
  public system: System
  public waypoint: Waypoint

  type: ObjectiveType.UPDATE_MARKET = ObjectiveType.UPDATE_MARKET;

  constructor(system: System, waypoint: Waypoint, requiredShipSymbol?: string) {
    super(`Update market data for ${waypoint.symbol}`);
    this.system = system;
    this.waypoint = waypoint;
    this.requiredShipSymbols = requiredShipSymbol ? [requiredShipSymbol] : [];
  }

  appropriateForShip(ship: Ship): boolean {
    return ship.maxCargo === 0 && (this.requiredShipSymbols.length === 0 || this.requiredShipSymbols.includes(ship.symbol));
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
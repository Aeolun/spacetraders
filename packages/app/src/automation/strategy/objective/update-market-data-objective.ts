import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {prisma, System, Waypoint} from '@common/prisma'
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {UpdateMarketTask} from "@auto/ship/task/update-market";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {appendTravelTasks} from "@auto/ship/behaviors/atoms/append-travel-tasks";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export class UpdateMarketDataObjective extends AbstractObjective {
  public system: System
  public waypoint: Waypoint
  startingLocation: LocationWithWaypointSpecifier

  type: ObjectiveType.UPDATE_MARKET = ObjectiveType.UPDATE_MARKET;

  constructor(system: System, waypoint: Waypoint, requiredShipSymbol?: string) {
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
    super(`Update market data for ${waypoint.symbol}`, location);
    this.startingLocation = location;
    this.system = system;
    this.waypoint = waypoint;
    this.requiredShipSymbols = requiredShipSymbol ? [requiredShipSymbol] : [];
  }

  appropriateFor(ship: Ship): boolean {
    return ship.maxCargo === 0 && (this.requiredShipSymbols.length === 0 || this.requiredShipSymbols.includes(ship.symbol));
  }
  
  async onStarted(ship: Ship, executionId: string): Promise<void> {}
  async onCompleted(ship: Ship, executionId: string): Promise<void> {}
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {}

  async constructTasks(ship: Ship) {
    const currentLocation = await waypointLocationFromSymbol(ship.currentWaypoint.symbol)
    const updateMarketLocation = await waypointLocationFromSymbol(this.waypoint.symbol)
    await appendTravelTasks(ship, currentLocation, updateMarketLocation)
    await ship.addTask(new UpdateMarketTask(this.startingLocation))
  }
}
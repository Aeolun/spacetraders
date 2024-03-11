import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {System, Waypoint } from '@common/prisma'
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {OffloadInventoryTask} from "@auto/ship/task/offload-inventory-task";
import {PickupCargoTask} from "@auto/ship/task/pickup-cargo";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {appendTravelTasks} from "@auto/ship/behaviors/atoms/append-travel-tasks";

export class PickupCargoObjective extends AbstractObjective {
  type: ObjectiveType.PICKUP_CARGO = ObjectiveType.PICKUP_CARGO;
  priority = 1.5;
  isPersistent = true;
  maxShips = 1;

  constructor(public system: System, public waypoint: Waypoint, private properties?: {
    waitForFullCargo?: boolean,
    tradeGoods?: TradeSymbol[]
    maxShips?: number
  }) {
    super(`Pickup ${properties?.tradeGoods ? properties.tradeGoods.join(', ') : 'goods' } at ${waypoint.symbol}`, {
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
    });
    if (properties?.maxShips) {
      this.maxShips = properties.maxShips
    }
  }

  async onStarted(ship: Ship, executionId: string): Promise<void> {}
  async onCompleted(ship: Ship, executionId: string): Promise<void> {}
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {}

  appropriateFor(ship: Ship): boolean {
    return ship.maxCargo > 40;
  }

  async constructTasks(ship: Ship): Promise<void> {
    const currentLocation = await waypointLocationFromSymbol(ship.currentWaypoint.symbol)
    const pickupLocation = await waypointLocationFromSymbol(this.waypoint.symbol)
    await appendTravelTasks(ship, currentLocation, pickupLocation)
    await ship.addTask(new PickupCargoTask(pickupLocation, this.properties?.tradeGoods, this.properties?.waitForFullCargo))
    await ship.addTask(new OffloadInventoryTask({
      expectedPosition: pickupLocation
    }))
  }
}
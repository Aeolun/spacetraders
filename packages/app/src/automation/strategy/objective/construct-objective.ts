import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { Waypoint } from '@common/prisma'
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {findPlaceToBuyGood} from "@auto/ship/behaviors/atoms/find-place-to-buy-good";
import {queryMarketToBuy} from "@auto/ship/behaviors/atoms/query-market-to-buy";
import {ConstructTask} from "@auto/ship/task/construct";
import {appendTravelTasks} from "@auto/ship/behaviors/atoms/append-travel-tasks";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export class ConstructObjective extends AbstractObjective {
  public tradeSymbol: TradeSymbol
  public amount: number
  startingLocation: LocationWithWaypointSpecifier
  priority = 1;
  isPersistent = true;
  type: ObjectiveType.CONSTRUCT = ObjectiveType.CONSTRUCT;

  constructor(private waypoint: Waypoint & { system: { symbol: string, x: number, y: number }}, tradeSymbol: TradeSymbol, amount: number, options: {
    maxShips?: number
    creditReservation?: number
  }) {
    const location = {
      system: {
        symbol: waypoint.system.symbol,
        x: waypoint.system.x,
        y: waypoint.system.y,
      },
      waypoint: {
        symbol: waypoint.symbol,
        x: waypoint.x,
        y: waypoint.y,
      }
    }
    super(`Construct ${waypoint.symbol} with ${tradeSymbol}`, location);
    this.startingLocation = location;
    this.tradeSymbol = tradeSymbol;
    this.amount = amount;
    this.maxShips = options.maxShips ?? 1;
    this.creditReservation = options.creditReservation ?? 0;
  }

  async onStarted(ship: Ship, executionId: string): Promise<void> {}
  async onCompleted(ship: Ship, executionId: string): Promise<void> {}
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {}

  appropriateFor(ship: Ship): boolean {
    return ship.maxCargo >= 40;
  }

  async constructTasks(ship: Ship): Promise<void> {
    const purchaseLocations = await queryMarketToBuy([this.tradeSymbol], this.startingLocation.system.symbol)
    const buyLocation = await findPlaceToBuyGood(purchaseLocations, this.waypoint, {[this.tradeSymbol]: Math.min(ship.maxCargo-ship.cargo, this.amount)})
    let lastLocation = this.startingLocation
    for(const location of buyLocation) {
      const purchaselocation = await waypointLocationFromSymbol(location.waypoint.symbol)
      await appendTravelTasks(ship, lastLocation, purchaselocation)
      for (const good of location.goods) {
        await ship.addTask(new PurchaseTask(purchaselocation, good.symbol, good.quantity, good.price * 1.4))
      }
      lastLocation = purchaselocation
    }

    const lastBuyLocation = await waypointLocationFromSymbol(buyLocation[buyLocation.length-1].waypoint.symbol)
    const selllocation = await waypointLocationFromSymbol(this.waypoint.symbol)
    await appendTravelTasks(ship, lastBuyLocation, selllocation)
    await ship.addTask(new ConstructTask(selllocation, this.tradeSymbol, Math.min(ship.maxCargo-ship.cargo, this.amount)))
  }
}
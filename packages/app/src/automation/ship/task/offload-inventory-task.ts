import {TradeSymbol} from "spacetraders-sdk";
import {findPlaceToSellGood} from "@auto/ship/behaviors/atoms/find-place-to-sell-good";
import {TravelTask} from "@auto/ship/task/travel";
import {SellTask} from "@auto/ship/task/sell";
import {prisma, TaskType} from "@common/prisma";
import {Ship} from "@auto/ship/ship";
import {queryMarketToSell} from "@auto/ship/behaviors/atoms/query-market-to-sell";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {craftTravelTasks} from "@auto/ship/behaviors/atoms/craft-travel-tasks";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";

export class OffloadInventoryTask extends AbstractTask {
  type = TaskType.OFFLOAD_INVENTORY;
  expectedPosition: LocationWithWaypointSpecifier

  constructor(data: {
    expectedPosition: LocationWithWaypointSpecifier
  }) {
    super(TaskType.OFFLOAD_INVENTORY, 1, data.expectedPosition)
    this.expectedPosition = data.expectedPosition
  }

  async execute(ship: Ship) {
    const saleLocationsInSameSystem = await queryMarketToSell(Object.keys(ship.currentCargo), ship.currentSystemSymbol)
    const whereToSell = await findPlaceToSellGood(saleLocationsInSameSystem, ship.currentWaypoint, ship.currentCargo)

    for(const location of whereToSell) {

      const target = await waypointLocationFromSymbol(location.waypoint.symbol);

      const travelTasks = await craftTravelTasks(this.expectedPosition, target, {
        maxFuel: ship.maxFuel,
        currentFuel: ship.fuel,
        speed: ship.engineSpeed,
      })
      for(const task of travelTasks) {
        await ship.addTask(task)
      }
      for (const good of location.goods) {
        await ship.addTask(new SellTask(target, good.symbol, good.quantity, 1))
      }
    }
  }

  serialize(): string {
    return JSON.stringify({
      expectedPosition: this.expectedPosition,
    })
  }
}

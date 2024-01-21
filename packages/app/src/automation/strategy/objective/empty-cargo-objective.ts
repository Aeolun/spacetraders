import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {prisma, Waypoint} from '@common/prisma'
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {SellTask} from "@auto/ship/task/sell";
import {findPlaceToSellGood} from "@auto/ship/behaviors/atoms/find-place-to-sell-good";
import {queryMarketToSell} from "@auto/ship/behaviors/atoms/query-market-to-sell";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {appendTravelTasks} from "@auto/ship/behaviors/atoms/append-travel-tasks";

export class EmptyCargoObjective extends AbstractObjective {
  type: ObjectiveType.EMPTY_CARGO = ObjectiveType.EMPTY_CARGO;

  constructor(public shipSymbol: string) {
    super(`Empty cargo for ${shipSymbol}`, 'self');
  }

  async onStarted(ship: Ship, executionId: string): Promise<void> {}
  async onCompleted(ship: Ship, executionId: string): Promise<void> {}
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {}

  appropriateFor(ship: Ship): boolean {
    return ship.symbol === this.shipSymbol;
  }

  async constructTasks(ship: Ship): Promise<void> {
    for(const cargo of Object.keys(ship.currentCargo)) {
      const tradeSymbol = cargo as TradeSymbol
      const cost = await prisma.consolidatedPrice.findFirst({
        where: {
          tradeGoodSymbol: tradeSymbol,
          systemSymbol: ship.currentSystemSymbol,
        }
      })
      if (ship.engineSpeed < 10 && (!cost || (cost?.sellP95 && cost.sellP95 < 500))) {
        ship.log("Not fast enough to sell this good, and not worth enough money, spacing it instead.")
        await ship.yeet(tradeSymbol, ship.currentCargo[tradeSymbol]);
      } else {
        const saleLocations = await queryMarketToSell(Object.keys(ship.currentCargo), ship.currentSystemSymbol)
        const whereToSell = await findPlaceToSellGood(saleLocations, ship.currentWaypoint, ship.currentCargo)

        for(const location of whereToSell) {
          const sellLocation = await waypointLocationFromSymbol(location.waypoint.symbol)
          await appendTravelTasks(ship, sellLocation)
          for (const good of location.goods) {
            await ship.addTask(new SellTask(sellLocation, good.symbol, good.quantity, 1))
          }
        }
      }
    }
  }
}
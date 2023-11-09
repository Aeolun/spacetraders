import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { Waypoint } from '@common/prisma'
import {TradeSymbol} from "spacetraders-sdk";
import {undefined} from "zod";
import {getDistance} from "@common/lib/getDistance";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {SellTask} from "@auto/ship/task/sell";
import {findPlaceToSellGood} from "@auto/ship/behaviors/atoms/find-place-to-sell-good";

export class EmptyCargoObjective extends AbstractObjective {
  type: ObjectiveType.TRADE = ObjectiveType.TRADE;

  constructor(public shipSymbol: string) {
    super(`Empty cargo for ${shipSymbol}`);
  }

  async onStarted(ship: Ship): Promise<void> {}
  async onCompleted(ship: Ship): Promise<void> {}

  appropriateForShip(ship: Ship): boolean {
    return true;
  }

  distanceToStart(ship: Ship): number {
    return 0;
  }

  async constructTasks(ship: Ship): Promise<void> {
    for(const cargo of Object.keys(ship.currentCargo)) {
      const tradeSymbol = cargo as TradeSymbol

      const whereToSell = await findPlaceToSellGood(ship, tradeSymbol)
      if (whereToSell) {

        await ship.addTask(new TravelTask({
          systemSymbol: whereToSell.systemSymbol,
          waypointSymbol: whereToSell.symbol,
        }))
        await ship.addTask(new SellTask({
          systemSymbol: whereToSell.systemSymbol,
          waypointSymbol: whereToSell.symbol,
        }, tradeSymbol, ship.currentCargo[tradeSymbol]))
      }
    }
  }
}
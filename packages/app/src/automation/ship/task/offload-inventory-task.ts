import {TradeSymbol} from "spacetraders-sdk";
import {findPlaceToSellGood} from "@auto/ship/behaviors/atoms/find-place-to-sell-good";
import {TravelTask} from "@auto/ship/task/travel";
import {SellTask} from "@auto/ship/task/sell";
import {TaskType} from "@common/prisma";
import {Ship} from "@auto/ship/ship";
import {TaskInterface} from "@auto/ship/task/task";

export class OffloadInventoryTask implements TaskInterface<Ship> {
  type = TaskType.OFFLOAD_INVENTORY;

  constructor() {}

  async execute(ship: Ship) {
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
        }, tradeSymbol, ship.currentCargo[tradeSymbol], 1))
      } else {
        ship.log("No place to offload " + tradeSymbol+` x${ship.currentCargo[tradeSymbol]} chucking it.`)
        await ship.yeet(tradeSymbol, ship.currentCargo[tradeSymbol])
      }
    }
  }

  serialize(): string {
    return JSON.stringify({})
  }
}

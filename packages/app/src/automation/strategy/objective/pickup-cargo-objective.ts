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
import {OffloadInventoryTask} from "@auto/ship/task/offload-inventory-task";
import {PickupCargoTask} from "@auto/ship/task/pickup-cargo";

export class PickupCargoObjective extends AbstractObjective {
  type: ObjectiveType.PICKUP_CARGO = ObjectiveType.PICKUP_CARGO;
  priority = 0.5;

  constructor(public waypoint: Waypoint, private properties?: {
    waitForFullCargo?: boolean,
    tradeGoods?: TradeSymbol[]
  }) {
    super(`Pickup ${properties?.tradeGoods ? properties.tradeGoods.join(', ') : 'goods' } at ${waypoint.symbol}`);
  }

  async onStarted(ship: Ship): Promise<void> {}
  async onCompleted(ship: Ship): Promise<void> {}

  appropriateForShip(ship: Ship): boolean {
    return ship.maxCargo >= 40;
  }

  distanceToStart(ship: Ship): number {
    return 0;
  }

  async constructTasks(ship: Ship): Promise<void> {
    await ship.addTask(new TravelTask({
      systemSymbol: this.waypoint.systemSymbol,
      waypointSymbol: this.waypoint.symbol,
    }))
    await ship.addTask(new PickupCargoTask(this.waypoint.symbol, this.properties?.tradeGoods, this.properties?.waitForFullCargo))
    await ship.addTask(new OffloadInventoryTask())
  }
}
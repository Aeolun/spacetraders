import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";

import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export class PurchaseTask extends AbstractTask {
  type = TaskType.PURCHASE;
  tradeSymbol: TradeSymbol
  units: number
  maxPrice: number
  expectedPosition: LocationWithWaypointSpecifier

  constructor(destination: LocationWithWaypointSpecifier, tradeSymbol: TradeSymbol, units: number, maxPrice: number) {
    super(TaskType.PURCHASE, 1, destination)
    this.tradeSymbol = tradeSymbol
    this.units = units
    this.maxPrice = maxPrice
    this.expectedPosition = destination
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.expectedPosition.waypoint.symbol) {
      throw new Error("Cannot purchase in a place we are not")
    }

    await ship.purchaseCargo(this.tradeSymbol, this.units, this.maxPrice)
  }

  serialize(): string {
    return JSON.stringify({
      expectedPosition: this.expectedPosition,
      tradeSymbol: this.tradeSymbol,
      units: this.units,
      maxPrice: this.maxPrice,
    })
  }
}
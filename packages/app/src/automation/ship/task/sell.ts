import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";

import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import z from "zod";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const sellPayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema,
  tradeSymbol: z.nativeEnum(TradeSymbol),
  units: z.number(),
  minSell: z.number()
})
export class SellTask extends AbstractTask {
  type = TaskType.SELL;
  tradeSymbol: TradeSymbol
  units: number
  minSell: number
  expectedPosition: LocationWithWaypointSpecifier

  constructor(destination: LocationWithWaypointSpecifier, tradeSymbol: TradeSymbol, units: number, expectedSell: number) {
    super(TaskType.SELL, 1, destination)
    this.expectedPosition = destination
    this.tradeSymbol = tradeSymbol
    this.units = units
    this.minSell = expectedSell
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.expectedPosition.waypoint.symbol) {
      throw new Error("Cannot sell in a place we are not")
    }

    await ship.sellCargo(this.tradeSymbol, this.units, undefined, this.minSell)
  }

  serialize(): string {
    return JSON.stringify({
      expectedPosition: this.expectedPosition,
      tradeSymbol: this.tradeSymbol,
      units: this.units,
      minSell: this.minSell
    } satisfies z.output<typeof sellPayloadSchema>)
  }
}
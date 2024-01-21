import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, TaskType} from "@common/prisma";

import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export class ConstructTask extends AbstractTask {
  destination: LocationWithWaypointSpecifier
  tradeSymbol: TradeSymbol
  units: number

  constructor(destination: LocationWithWaypointSpecifier, tradeSymbol: TradeSymbol, units: number) {
    super(TaskType.CONSTRUCT, 1, destination);
    this.destination = destination;
    this.tradeSymbol = tradeSymbol;
    this.units = units;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.destination.waypoint.symbol) {
      throw new Error("Cannot construct a waypoint we are not")
    }

    const unitsRemaining = await prisma.material.findFirstOrThrow({
      where: {
        constructionId: this.destination.waypoint?.symbol,
        tradeGoodSymbol: this.tradeSymbol
      }
    })
    await ship.construct(this.tradeSymbol, Math.min(this.units, unitsRemaining.required - unitsRemaining.fulfilled))
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.destination,
      tradeSymbol: this.tradeSymbol,
      units: this.units,
    })
  }
}
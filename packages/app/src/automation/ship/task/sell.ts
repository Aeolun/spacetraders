import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/task";

export class SellTask implements TaskInterface<Ship> {
  type = TaskType.SELL;
  destination: {
    systemSymbol: string;
    waypointSymbol: string;
  }
  tradeSymbol: TradeSymbol
  units: number
  minSell: number

  constructor(destination: { systemSymbol: string; waypointSymbol: string }, tradeSymbol: TradeSymbol, units: number, expectedSell: number) {
    this.destination = destination;
    this.tradeSymbol = tradeSymbol;
    this.units = units;
    this.minSell = expectedSell;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.destination.waypointSymbol) {
      throw new Error("Cannot sell in a place we are not")
    }

    await ship.sellCargo(this.tradeSymbol, this.units, undefined, this.minSell)
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.destination,
      tradeSymbol: this.tradeSymbol,
      units: this.units,
      minSell: this.minSell
    })
  }
}
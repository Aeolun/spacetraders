import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/taskInterface";

export class SellTask implements TaskInterface {
  type = TaskType.SELL;
  destination: {
    systemSymbol: string;
    waypointSymbol: string;
  }
  tradeSymbol: TradeSymbol
  units: number


  constructor(destination: { systemSymbol: string; waypointSymbol: string }, tradeSymbol: TradeSymbol, units: number) {
    this.destination = destination;
    this.tradeSymbol = tradeSymbol;
    this.units = units;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.destination.waypointSymbol) {
      throw new Error("Cannot sell in a place we are not")
    }

    await ship.sellCargo(this.tradeSymbol, this.units)
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.destination,
      tradeSymbol: this.tradeSymbol,
      units: this.units
    })
  }
}
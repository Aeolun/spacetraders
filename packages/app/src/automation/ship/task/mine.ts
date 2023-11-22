import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/taskInterface";

export class MineTask implements TaskInterface {
  type = TaskType.MINE;
  destination: {
    systemSymbol: string;
    waypointSymbol: string;
  }
  units: number

  constructor(destination: { systemSymbol: string; waypointSymbol: string }, units: number) {
    this.destination = destination;
    this.units = units;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.destination.waypointSymbol) {
      throw new Error("Cannot mine in a place we are not")
    }

    let extracted = 0;
    while (extracted < this.units) {
      if (ship.cargo >= ship.maxCargo) {
        await ship.waitFor(10000, "Cargo full, cannot continue extract task.")
      } else {
        const result = await ship.extract()
        extracted += result.extract.data.extraction.yield.units
      }
    }
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.destination,
      units: this.units,
    })
  }
}
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/task";

export class SiphonTask implements TaskInterface<Ship> {
  type = TaskType.SIPHON;
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
      throw new Error("Cannot siphon in a place we are not")
    }

    let extracted = 0;
    await prisma.ship.update({
      where: {
        symbol: ship.symbol
      },
      data: {
        cargoState: "OPEN_PICKUP"
      }
    })
    try {
      let emptyTime = Date.now()
      while (extracted < this.units) {
        if (Date.now() - emptyTime > 1000 * 60 * 240) {
          await ship.waitFor(10000, "Siphoning task timed out after 4 hours without pickup.")
          break;
        } else if (ship.cargo >= ship.maxCargo) {
          await ship.waitFor(10000, "Cargo full, wait until our cargo is picked up.")
        } else if (extracted > this.units) {
          await ship.log(`Finished siphoning ${this.units} units.`)
          break;
        } else {
          emptyTime = Date.now()
          const result = await ship.siphon()
          extracted += result.siphon.data.siphon.yield.units
        }
      }
    } finally {
      await prisma.ship.update({
        where: {
          symbol: ship.symbol
        },
        data: {
          cargoState: "MANAGED"
        }
      })
    }
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.destination,
      units: this.units,
    })
  }
}
import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, TaskType} from "@common/prisma";

import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import z from "zod";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const siphonPayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema,
  units: z.number(),
})

export class SiphonTask extends AbstractTask {
  type = TaskType.SIPHON;
  expectedPosition: LocationWithWaypointSpecifier
  units: number

  constructor(destination: LocationWithWaypointSpecifier, units: number) {
    super(TaskType.SIPHON, 1, destination)
    this.expectedPosition = destination
    this.units = units;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.expectedPosition.waypoint.symbol) {
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
        }
        if (ship.cargo >= ship.maxCargo) {
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
      expectedPosition: this.expectedPosition,
      units: this.units,
    } satisfies z.output<typeof siphonPayloadSchema>)
  }
}
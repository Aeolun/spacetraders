import {Ship} from "@auto/ship/ship";
import {prisma, TaskType} from "@common/prisma";

import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import { z } from "zod";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const minePayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema,
  units: z.number(),
})
export class MineTask extends AbstractTask {
  type = TaskType.MINE;
  expectedPosition: LocationWithWaypointSpecifier
  units: number

  constructor(destination: LocationWithWaypointSpecifier, units: number) {
    super(TaskType.MINE, 1, destination)
    this.expectedPosition = destination
    this.units = units;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.expectedPosition.waypoint.symbol) {
      throw new Error("Cannot mine in a place we are not")
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
      while (true) {
        if (Date.now() - emptyTime > 1000 * 60 * 240) {
          await ship.waitFor(10000, "Mining task timed out after 4 hours without pickup.")
          break;
        }

        if (ship.cargo >= ship.maxCargo) {
          await ship.waitFor(10000, "Cargo full, wait until our cargo is picked up.")
        } else if (ship.cargo === 0 && extracted > this.units) {
          // do not finish extraction if you still have cargo inside, this would trigger the 'figure out where
          // to drop it routine'
          await ship.log(`Finished extracting ${extracted}/${this.units} units.`)
          break;
        }

        emptyTime = Date.now()

        const isUnstable = await prisma.waypoint.findFirst({
          where: {
            symbol: ship.currentWaypointSymbol,
            modifiers: {
              some: {
                symbol: "UNSTABLE"
              }
            }
          },
        })
        if (isUnstable) {
          await ship.log('Waypoint unstable, cannot continue extracting here.')
          break;
        }

        const survey = await prisma.survey.findFirst({
          where: {
            waypointSymbol: ship.currentWaypointSymbol,
            expiration: {
              gt: new Date(Date.now() + 60000).toISOString()
            }
          },
          orderBy: {
            value: 'desc'
          }
        })
        const result = await ship.extract(survey ? JSON.parse(survey.payload) : undefined)
        extracted += result.extract.data.extraction.yield.units
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
    } satisfies z.output<typeof minePayloadSchema>)
  }
}
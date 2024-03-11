import {Ship} from "@auto/ship/ship";
import {defaultWayfinder} from "@common/default-wayfinder";
import {prisma, TaskType} from "@common/prisma";

import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import z from "zod";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const explorePayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema,
  expectedDuration: z.number()
})


export class ExploreTask extends AbstractTask {
  expectedPosition: LocationWithWaypointSpecifier;

  constructor(data: {
    expectedPosition: LocationWithWaypointSpecifier
    expectedDuration: number
  }) {
    super(TaskType.EXPLORE, data.expectedDuration, data.expectedPosition)
    this.expectedPosition = data.expectedPosition
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol === this.expectedPosition.waypoint.symbol) {
      // go and explore
      const chartResult = await ship.chart();

      const hasShipyard = chartResult.waypoint?.traits.some(
        (t) => t.symbol === "SHIPYARD"
      );
      const hasMarketplace = chartResult.waypoint?.traits.some(
        (t) => t.symbol === "MARKETPLACE"
      );
      if (hasMarketplace || hasShipyard) {
        await ship.dock();
        if (hasMarketplace) {
          await ship.market();
          await ship.attemptRefuel();
        }
        if (hasShipyard) {
          await ship.shipyard();
        }
        await ship.orbit();
      }

      if (chartResult.waypoint?.type === "JUMP_GATE") {
        await ship.jumpgate();
        await defaultWayfinder.addSystemFromDatabase(ship.currentSystem.symbol);
      }

      if (chartResult.waypoint?.isUnderConstruction) {
        await ship.construction();
      }

      await prisma.waypoint.update({
        where: {
          symbol: ship.currentWaypointSymbol
        },
        data: {
          exploreStatus: 'EXPLORED'
        }
      })
    } else {
      throw new Error(`Not at the location to explore. Need to be at ${this.expectedPosition.waypoint.symbol} but at ${ship.currentWaypointSymbol}.`)
    }
  }

  serialize(): string {
    return JSON.stringify({
      expectedPosition: this.expectedPosition,
      expectedDuration: this.expectedDuration
    } satisfies z.output<typeof explorePayloadSchema>);
  }
}
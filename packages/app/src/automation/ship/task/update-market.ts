import {Ship} from "@auto/ship/ship";
import {prisma, TaskType} from "@common/prisma";

import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import z from "zod";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const updateMarketPayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema
})

export class UpdateMarketTask extends AbstractTask {
  type = TaskType.UPDATE_MARKET;
  expectedPosition: LocationWithWaypointSpecifier

  constructor(waypointL: LocationWithWaypointSpecifier) {
    super(TaskType.UPDATE_MARKET, 1, waypointL)
    this.expectedPosition = waypointL
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol === this.expectedPosition.waypoint.symbol) {
      const waypoint = await prisma.waypoint.findUnique({
        where: {
          symbol: this.expectedPosition.waypoint.symbol
        },
        include: {
          traits: true
        }
      })

      const hasShipyard = waypoint?.traits.some(
        (t) => t.symbol === "SHIPYARD"
      );
      const hasMarketplace = waypoint?.traits.some(
        (t) => t.symbol === "MARKETPLACE"
      );
      if (hasMarketplace || hasShipyard) {
        if (hasMarketplace) {
          await ship.market();
        }
        if (hasShipyard) {
          await ship.shipyard();
        }
      }

      await prisma.waypoint.update({
        where: {
          symbol: ship.currentWaypointSymbol
        },
        data: {
          marketLastUpdated: new Date()
        }
      })
    } else {
      throw new Error(`Not at the location to update market. Need to be at ${this.expectedPosition.waypoint.symbol} but at ${ship.currentWaypointSymbol}.`)
    }
  }

  serialize(): string {
    return JSON.stringify({
      expectedPosition: this.expectedPosition,
    } satisfies z.output<typeof updateMarketPayloadSchema>);
  }
}
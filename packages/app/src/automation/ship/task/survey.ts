import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {CargoState, prisma, TaskType} from "@common/prisma";

import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import z from "zod";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const surveyPayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema,
  count: z.number(),
})
export class SurveyTask extends AbstractTask {
  type = TaskType.SURVEY;
  expectedPosition: LocationWithWaypointSpecifier
  count: number

  constructor(destination: LocationWithWaypointSpecifier, count: number) {
    super(TaskType.SURVEY, 1, destination)
    this.expectedPosition = destination
    this.count = count;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.expectedPosition.waypoint.symbol) {
      throw new Error("Cannot survey a place we are not")
    }
    
    for(let i = 0; i < this.count; i++) {
      const otherShipsAtCurrentWaypoint = await prisma.ship.findMany({
        where: {
          currentWaypointSymbol: this.expectedPosition.waypoint.symbol,
          symbol: {
            not: ship.symbol
          },
          cargoState: CargoState.OPEN_PICKUP
        },
        include: {
          cargo: true
        },
      })

      if (otherShipsAtCurrentWaypoint.length === 0) {
        ship.log("No other mining ships at waypoint, exiting survey task. Wonder where they went?", "WARN")
        break;
      }

      await ship.survey()
    }
  }

  serialize(): string {
    return JSON.stringify({
      expectedPosition: this.expectedPosition,
      count: this.count,
    } satisfies z.output<typeof surveyPayloadSchema>)
  }
}
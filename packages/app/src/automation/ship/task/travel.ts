import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, TaskType} from "@common/prisma";
import {defaultSystemWayfinder} from "@common/default-wayfinder";
import {findTrades} from "@auto/ship/behaviors/atoms/find-trades";
import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {StrategySettings} from "@auto/strategy/stategy-settings";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import z from "zod";
import {LocationWithWaypointSpecifierSchema, ShipNavFlightModeSchema} from "@auto/lib/schemas";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const travelPayloadSchema = z.object({
  destination: LocationWithWaypointSpecifierSchema,
  travelMethod: z.union([z.literal('jump'), ShipNavFlightModeSchema]),
  expectedDuration: z.number().optional(),
  fuelAfter: z.number().optional()
})

export class TravelTask extends AbstractTask implements DeserializesTask{
  type = TaskType.TRAVEL;
  travelMethod: ShipNavFlightMode | 'jump'
  expectedPosition: LocationWithWaypointSpecifier
  fuelAfter?: number

  constructor(destination: LocationWithWaypointSpecifier, travelMethod: ShipNavFlightMode | 'jump', expectedDuration: number, fuelAfter?: number) {
    super(TaskType.TRAVEL, expectedDuration, destination)
    this.travelMethod = travelMethod
    this.expectedPosition = destination
    this.fuelAfter = fuelAfter
  }

  async execute(ship: Ship) {
    if (ship.currentSystemSymbol === this.expectedPosition.system.symbol && ship.currentWaypointSymbol === this.expectedPosition.waypoint.symbol) {
      //already there
    } else if (ship.currentSystemSymbol === this.expectedPosition.system.symbol) {
      const sameCoordinate = ship.currentWaypoint.x === this.expectedPosition.waypoint?.x && ship.currentWaypoint.y === this.expectedPosition.waypoint?.y
      if (StrategySettings.CURRENT_CREDITS < 5_000 && !sameCoordinate) {
        await ship.navigateMode(ShipNavFlightMode.Drift, "Out of credits")
      } else if (sameCoordinate && this.travelMethod !== 'jump') {
        await ship.navigateMode(this.travelMethod, "Same coordinate")
      } else {
        if (this.travelMethod === 'jump') {
          throw new Error("Cannot travel to a location in the same system by jumping")
        }
        await ship.navigateMode(this.travelMethod, "Normal travel")
        await ship.attemptRefuel();
      }

      await ship.navigate(this.expectedPosition.waypoint.symbol)
      await ship.waitForNavigationCompletion()
    } else {
      //warp to system
      await ship.warp(this.expectedPosition.waypoint.symbol)
    }
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.expectedPosition,
      travelMethod: this.travelMethod,
      expectedDuration: this.expectedDuration,
      fuelAfter: this.fuelAfter
    } satisfies z.output<typeof travelPayloadSchema>)
  }
}
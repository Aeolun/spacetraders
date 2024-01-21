import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, TaskType} from "@common/prisma";
import {defaultSystemWayfinder} from "@common/default-wayfinder";
import {findTrades} from "@auto/ship/behaviors/atoms/find-trades";
import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {StrategySettings} from "@auto/strategy/stategy-settings";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export class TravelTask extends AbstractTask {
  type = TaskType.TRAVEL;
  travelMethod: ShipNavFlightMode | 'jump'
  expectedPosition: LocationWithWaypointSpecifier

  constructor(destination: LocationWithWaypointSpecifier, travelMethod: ShipNavFlightMode | 'jump', expectedDuration: number) {
    super(TaskType.TRAVEL, expectedDuration, destination)
    this.travelMethod = travelMethod
    this.expectedPosition = destination
  }

  async execute(ship: Ship) {
    if (ship.currentSystemSymbol === this.expectedPosition.system.symbol && ship.currentWaypointSymbol === this.expectedPosition.waypoint.symbol) {
      //already there
    } else if (ship.currentSystemSymbol === this.expectedPosition.system.symbol) {
      const sameLocation = ship.currentWaypoint.x === this.expectedPosition.waypoint?.x && ship.currentWaypoint.y === this.expectedPosition.waypoint?.y
      if (StrategySettings.CURRENT_CREDITS < 5_000 && !sameLocation) {
        await ship.navigateMode(ShipNavFlightMode.Drift)
      } else if (sameLocation && this.travelMethod !== 'jump') {
        await ship.navigateMode(this.travelMethod)
      } else {
        if (this.travelMethod === 'jump') {
          throw new Error("Cannot travel to a location in the same system by jumping")
        }
        await ship.navigateMode(this.travelMethod)
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
      duration: this.expectedDuration
    })
  }
}
import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { System, prisma, ExploreStatus } from '@common/prisma'
import {Ship} from "@auto/ship/ship";
import {getExplorableWaypointsInOrder} from "@auto/ship/behaviors/atoms/get-explorable-waypoints-in-order";
import {TravelTask} from "@auto/ship/task/travel";
import {ExploreTask} from "@auto/ship/task/explore";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {appendTravelTasks} from "@auto/ship/behaviors/atoms/append-travel-tasks";
import canvas from 'canvas'
import fs from "fs";

export class ExploreObjective extends AbstractObjective {
  public system: System
  type: ObjectiveType.EXPLORE = ObjectiveType.EXPLORE;

  constructor(system: System) {
    super(`Explore ${system.symbol}`, {
      system: {
        symbol: system.symbol,
        x: system.x,
        y: system.y,
      }
    });
    this.system = system;
  }

  appropriateFor(ship: Ship): boolean {
    return ship.engineSpeed > 10
  }

  async onStarted(ship: Ship) {
    // mark system as being explored
    prisma.system.update({
      where: {
        symbol: this.system.symbol
      },
      data: {
        exploreStatus: ExploreStatus.EXPLORING
      }
    })
  }
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {
    // mark system as being explored
    prisma.system.update({
      where: {
        symbol: this.system.symbol
      },
      data: {
        exploreStatus: ExploreStatus.UNEXPLORED
      }
    })
  }

  async constructTasks(ship: Ship) {
    if (ship.currentSystemSymbol !== this.system.symbol) {
      // add tasks to travel to target system
    }

    // add tasks to explore all waypoints
    const orderedWaypoints = await getExplorableWaypointsInOrder(ship, this.system)
    // output a map of the exploration route
    const draw = new canvas.Canvas(1800, 1800)
    const ctx = draw.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1800, 1800)
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(ship.currentWaypoint.x + 900, ship.currentWaypoint.y + 900)
    for (const waypoint of orderedWaypoints) {
      const location = await waypointLocationFromSymbol(waypoint.symbol)
      ctx.lineTo(location.waypoint.x + 900, location.waypoint.y + 900)
      ctx.stroke()
    }
    ctx.closePath()
    fs.writeFileSync(`./exploration-route-${this.system.symbol}.png`, draw.toBuffer())

    if (orderedWaypoints.length === 0) {
      await prisma.system.update({
        where: {
          symbol: this.system.symbol,
        },
        data: {
          exploreStatus: ExploreStatus.EXPLORED,
        },
      });
      return;
    }

    let lastLocation = await waypointLocationFromSymbol(ship.currentWaypoint.symbol)
    for (const waypoint of orderedWaypoints) {
      const exploreLocation = await waypointLocationFromSymbol(waypoint.symbol)
      await appendTravelTasks(ship, lastLocation, exploreLocation)
      await ship.addTask(new ExploreTask({
        expectedPosition: exploreLocation,
        expectedDuration: 3
      }))
      lastLocation = exploreLocation
    }
  }

  async onCompleted(ship: Ship) {
    // mark system as explored
    prisma.system.update({
      where: {
        symbol: this.system.symbol
      },
      data: {
        exploreStatus: ExploreStatus.EXPLORED
      }
    })
  }
}
import {defaultSystemWayfinder} from "@common/default-wayfinder";
import {prisma, Waypoint} from "@common/prisma";
import {StrategySettings} from "@auto/strategy/stategy-settings";
import {ShipNavFlightMode} from "spacetraders-sdk";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {Task} from "@auto/ship/task/task";
import {TravelTask} from "@auto/ship/task/travel";
import {getDistance} from "@common/lib/getDistance";
import {jumpCooldown} from "@auto/ship/behaviors/atoms/jump-cooldown";
import {travelCooldown} from "@auto/ship/behaviors/atoms/travel-cooldown";

export const craftTravelTasks = async (from: LocationWithWaypointSpecifier, to: LocationWithWaypointSpecifier, options: {
  currentFuel: number,
  maxFuel: number,
  speed: number
}) => {
  await defaultSystemWayfinder.loadSystemFromDb(to.system.symbol)
  let route;
  if (options.maxFuel === 0) {
    route = await defaultSystemWayfinder.findRouteNoFuel(from.waypoint.symbol, to.waypoint.symbol)
  } else {
    const fuelHere = await prisma.marketPrice.findFirst({
      where: {
        waypointSymbol: from.waypoint.symbol,
        tradeGoodSymbol: 'FUEL'
      }
    })
    route = await defaultSystemWayfinder.findRoute(from.waypoint.symbol, to.waypoint.symbol, {
      max: options.maxFuel,
      // if fuel is sold at current waypoint we'll refuel before leaving, so plan route using that in mind
      current: fuelHere ? options.maxFuel : options.currentFuel
    })
  }
  //warp to waypoint

  const tasks: Task[] = []
  let lastWaypoint: Waypoint & { system: { symbol: string, x: number, y: number }} | null = null
  for(const step of route.finalPath) {
    if (!lastWaypoint) {
      lastWaypoint = await prisma.waypoint.findFirst({
        where: {
          symbol: step.source
        },
        include: {
          system: {
            select: {
              symbol: true,
              x: true,
              y: true
            }
          }
        }
      })
    }
    const targetWaypoint = await prisma.waypoint.findFirst({
      where: {
        symbol: step.target
      },
      include: {
        system: {
          select: {
            symbol: true,
            x: true,
            y: true
          }
        }
      }
    })

    if (!targetWaypoint) {
      throw new Error(`Could not find waypoint ${step.target}`)
    }
    if (!lastWaypoint) {
      throw new Error(`Could not find waypoint ${step.source}`)
    }

    const travelMode = step.edge === 'jump' ? 'jump' : step.edge === 'cruise' ? ShipNavFlightMode.Cruise : step.edge === 'burn' ? ShipNavFlightMode.Burn : ShipNavFlightMode.Drift
    const expectedTravelTime = travelMode === 'jump' ? jumpCooldown(getDistance(targetWaypoint, lastWaypoint)) : travelCooldown(getDistance(targetWaypoint, lastWaypoint), travelMode, options.speed)

    const travelTask = new TravelTask({
      waypoint: {
        symbol: targetWaypoint.symbol,
        x: targetWaypoint.x,
        y: targetWaypoint.y
      },
      system: {
        symbol: targetWaypoint.system.symbol,
        x: targetWaypoint.system.x,
        y: targetWaypoint.system.y
      }
    }, travelMode, expectedTravelTime)
    lastWaypoint = targetWaypoint

    tasks.push(travelTask)
  }
  return tasks;
}
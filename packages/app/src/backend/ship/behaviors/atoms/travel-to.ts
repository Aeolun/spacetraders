import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@app/ship/ship";
import {LinkedListItem} from "@aeolun/dijkstra-calculator";
import {defaultWayfinder, printRoute} from "@app/wayfinding";
import {prisma, Waypoint} from "@app/prisma";

export const travelTo = async (ship: Ship, waypoint: Waypoint, options: {
  preferJump: boolean
  executeEveryStop?: () => Promise<void>
} = { preferJump: true }) => {
  await ship.setTravelGoal(waypoint.symbol);
  if (ship.currentSystemSymbol !== waypoint.systemSymbol) {
    let route: LinkedListItem[] = []
    if (ship.hasWarpDrive && !options?.preferJump) {
      const result = await defaultWayfinder.findRoute(ship.currentSystemSymbol, waypoint.systemSymbol, {
        max: ship.maxFuel,
        current: ship.fuel
      })
      route = result.finalPath
      printRoute(route, result.pathProperties)
    } else {
      const result = await defaultWayfinder.findJumpRoute(ship.currentSystemSymbol, waypoint.systemSymbol, {
        max: ship.maxFuel,
        current: ship.fuel
      })
      route = result.finalPath
      printRoute(route, result.pathProperties)
    }

    if (route.length <= 0) {
      throw new Error(`Cannot find a route to ${waypoint.systemSymbol} from ${ship.currentSystemSymbol}.`)
    }

    for (const nextSystem of route) {
      if (nextSystem.edge === 'burn' && ship.navMode !== ShipNavFlightMode.Burn) {
        await ship.navigateMode(ShipNavFlightMode.Burn)
      } else if (nextSystem.edge === 'cruise' && ship.navMode !== ShipNavFlightMode.Cruise) {
        await ship.navigateMode(ShipNavFlightMode.Cruise)
      } else if (nextSystem.edge === 'drift' && ship.navMode !== ShipNavFlightMode.Drift) {
        await ship.navigateMode(ShipNavFlightMode.Drift)
      }

      if (nextSystem.edge === 'jump') {
        // make sure we're always at the jump gate if one exists
        const systemJumpgateWaypoint = await prisma.waypoint.findFirst({
          where: {
            systemSymbol: ship.currentSystemSymbol,
            type: 'JUMP_GATE'
          }
        })
        if (systemJumpgateWaypoint && ship.currentWaypointSymbol !== systemJumpgateWaypoint.symbol) {
          await ship.navigate(systemJumpgateWaypoint.symbol)
        }

        await ship.jump(nextSystem.target)
        await options?.executeEveryStop?.()
      } else {
        const availableWaypoints = await prisma.waypoint.findMany({
          where: {
            systemSymbol: nextSystem.target,
          }
        })
        const targetWaypoint = availableWaypoints.find(w => w.symbol === waypoint.symbol)

        const target = targetWaypoint ? targetWaypoint.symbol : availableWaypoints.length > 0 ? availableWaypoints[0].symbol : undefined
        if (ship.currentSystemSymbol === nextSystem.target) {
          ship.log(`Already at system ${nextSystem.target}`)
        } else if (target) {
          await ship.warp(target)
          await options?.executeEveryStop?.()
        } else {
          await ship.log(`Cannot warp to system ${nextSystem.target} without waypoints`)
          throw new Error("Cannot warp to system without waypoints")
        }
      }
    }
    // navigate to preferred symbol if not already there
    if (waypoint.symbol && ship.currentWaypointSymbol !== waypoint.symbol) {
      await ship.navigate(waypoint.symbol)
    }
  } else {
    ship.log(`No need to warp/jump, already at ${waypoint.systemSymbol}.`)
    if (waypoint.symbol && ship.currentWaypointSymbol !== waypoint.symbol) {
      ship.log(`Will navigate to preferred waypoint ${waypoint.symbol}.`)
      await ship.navigate(waypoint.symbol)
    }
  }
  await ship.setTravelGoal(null)
}
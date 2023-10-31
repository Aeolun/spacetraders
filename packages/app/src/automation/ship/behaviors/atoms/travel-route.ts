import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, Waypoint} from "@common/prisma";
import {Route} from "@auto/ship/behaviors/atoms/find-route-to";

export const travelRoute = async (ship: Ship, route: Route, options?: {
  executeEveryStop?: () => Promise<void>
}) => {
  for (const nextSystem of route) {
    if (nextSystem.flightMode !== 'jump' && nextSystem.flightMode !== ship.navMode) {
      await ship.navigateMode(nextSystem.flightMode)
    }

    if (nextSystem.flightMode === 'jump') {
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

      await ship.jump(nextSystem.toWaypointSymbol)
      await options?.executeEveryStop?.()
    } else {
      const availableWaypoints = await prisma.waypoint.findMany({
        where: {
          systemSymbol: nextSystem.toSystemSymbol,
        }
      })

      const target = nextSystem.toWaypointSymbol ? nextSystem.toWaypointSymbol : availableWaypoints.length > 0 ? availableWaypoints[0].symbol : undefined

      if (target) {
        await ship.warp(target)
        await options?.executeEveryStop?.()
      } else {
        throw new Error(`Cannot warp to system ${nextSystem.toSystemSymbol} without waypoints`)
      }
    }
  }
}
import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {LinkedListItem} from "@aeolun/dijkstra-calculator";
import {defaultWayfinder} from "@common/default-wayfinder";
import { Waypoint, System } from "@common/prisma";
import {StrategySettings} from "@auto/strategy/stategy-settings";

export type Route = {
  fromSystemSymbol: string,
  toSystemSymbol: string,
  toWaypointSymbol?: string,
  flightMode: ShipNavFlightMode | 'jump'
}[]

export const findRouteTo = async (ship: Ship, system: System, waypoint?: Waypoint): Promise<Route> => {
  let route: LinkedListItem[];
  if (ship.hasWarpDrive && StrategySettings.USE_WARP) {
      const result = await defaultWayfinder.findRoute(ship.currentSystemSymbol, system.symbol, {
        max: ship.maxFuel,
        current: ship.fuel
      })
      route = result.finalPath
    } else {
      const result = await defaultWayfinder.findJumpRoute(ship.currentSystemSymbol, system.symbol, {
        max: ship.maxFuel,
        current: ship.fuel
      })
      route = result.finalPath
    }

    if (route.length <= 0) {
      throw new Error(`Cannot find a route to ${system.symbol} from ${ship.currentSystemSymbol}.`)
    }

    const map = {
      cruise: ShipNavFlightMode.Cruise,
      drift: ShipNavFlightMode.Drift,
      burn: ShipNavFlightMode.Burn,
      jump: 'jump'
    }

    return route.map(item => {
      return {
        fromSystemSymbol: item.source,
        toSystemSymbol: item.target,
        toWaypointSymbol: item.target === waypoint.systemSymbol ? waypoint.symbol : undefined,
        flightMode: map[item.edge],
      }
    });
}
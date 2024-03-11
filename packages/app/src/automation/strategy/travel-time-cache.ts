import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {defaultSystemWayfinder, defaultWayfinder} from "@common/default-wayfinder";

const times: Record<string, Record<string, Record<string, Record<string, number>>>> = {};
export const TravelTimeCache = {
  async calculateFromMany(speed: 3 | 10 | 30, fuelCapacity: number, positions: LocationWithWaypointSpecifier[], position: LocationWithWaypointSpecifier) {
    for(const from of positions) {
      await this.calculate(speed, fuelCapacity, from, position);
    }
  },

  async calculate(speed: 3 | 10 | 30, fuelCapacity: number, from: LocationWithWaypointSpecifier, to: LocationWithWaypointSpecifier) {
    if (times[from.waypoint.symbol]?.[to.waypoint.symbol]?.[speed]?.[fuelCapacity]) {
      return times[from.waypoint.symbol][to.waypoint.symbol][speed][fuelCapacity];
    }

    if (from.waypoint.symbol === to.waypoint.symbol) {
      return 0
    }

    let result;
    if (fuelCapacity === 0) {
      result = await defaultSystemWayfinder.findRouteNoFuel(from.waypoint.symbol, to.waypoint.symbol);
    } else {
      result = await defaultSystemWayfinder.findRoute(from.waypoint.symbol, to.waypoint.symbol, {
        max: fuelCapacity,
        current: fuelCapacity,
      });
    }


    const time = result?.pathProperties.totalConsumed?.[`time${speed}`]
    if (time !== undefined) {
      if (!times[from.waypoint.symbol]) {
        times[from.waypoint.symbol] = {};
      }
      if (!times[from.waypoint.symbol][to.waypoint.symbol]) {
        times[from.waypoint.symbol][to.waypoint.symbol] = {};
      }
      if (!times[from.waypoint.symbol][to.waypoint.symbol][speed]) {
        times[from.waypoint.symbol][to.waypoint.symbol][speed] = {};
      }
      times[from.waypoint.symbol][to.waypoint.symbol][speed][fuelCapacity] = time;
    } else {
      throw new Error(`Could not calculate time (${time}) from ${from.waypoint.symbol} to ${to.waypoint.symbol} with speed ${speed} and fuel capacity ${fuelCapacity}`)
    }

    return times[from.waypoint.symbol][to.waypoint.symbol][speed][fuelCapacity]
  },

  get(speed: 2 | 10 | 30, fuelCapacity: number, from: LocationWithWaypointSpecifier, to: LocationWithWaypointSpecifier) {
    return times[from.waypoint.symbol][to.waypoint.symbol][speed][fuelCapacity];
  }
}
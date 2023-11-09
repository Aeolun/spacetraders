import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/taskInterface";
import {defaultSystemWayfinder} from "@common/default-wayfinder";

export class TravelTask implements TaskInterface {
  type = TaskType.TRAVEL;
  destination: {
    systemSymbol: string;
    waypointSymbol: string;
  }

  constructor(destination: { systemSymbol: string; waypointSymbol: string }) {
    this.destination = destination;
  }

  async execute(ship: Ship) {
    if (ship.currentSystemSymbol === this.destination.systemSymbol && ship.currentWaypointSymbol === this.destination.waypointSymbol) {
      //already there
    } else if (ship.currentSystemSymbol === this.destination.systemSymbol) {
      await defaultSystemWayfinder.loadSystemFromDb(this.destination.systemSymbol)
      let route;
      if (ship.maxFuel === 0) {
        route = await defaultSystemWayfinder.findRouteNoFuel(ship.currentWaypointSymbol, this.destination.waypointSymbol)
      } else {
        route = await defaultSystemWayfinder.findRoute(ship.currentWaypointSymbol, this.destination.waypointSymbol, {
          max: ship.maxFuel,
          current: ship.fuel
        })
      }
      //warp to waypoint
      for(const step of route.finalPath) {
        await ship.navigateMode(step.edge === 'drift' ? ShipNavFlightMode.Drift : step.edge === 'burn' ? ShipNavFlightMode.Burn : ShipNavFlightMode.Cruise)
        await ship.attemptRefuel();
        await ship.navigate(step.target)
      }
    } else {
      //warp to system
      await ship.warp(this.destination.systemSymbol)
    }
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.destination,
    })
  }
}
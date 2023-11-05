import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/taskInterface";
import {defaultSystemWayfinder} from "@common/default-wayfinder";

export class PurchaseTask implements TaskInterface {
  type = TaskType.PURCHASE;
  destination: {
    systemSymbol: string;
    waypointSymbol: string;
  }
  flightMode: ShipNavFlightMode = 'CRUISE'


  constructor(destination: { systemSymbol: string; waypointSymbol: string }, options?: { flightMode?: ShipNavFlightMode }) {
    this.destination = destination;
    if (options?.flightMode) {
      this.flightMode = options.flightMode
    }
  }

  async execute(ship: Ship) {
    if (ship.currentSystemSymbol === this.destination.systemSymbol && ship.currentWaypointSymbol === this.destination.waypointSymbol) {
      //already there
    } else if (ship.currentSystemSymbol === this.destination.systemSymbol) {
      await defaultSystemWayfinder.loadSystemFromDb(this.destination.systemSymbol)
      const route = await defaultSystemWayfinder.findRoute(ship.currentWaypointSymbol, this.destination.waypointSymbol, {
        max: ship.maxFuel,
        current: ship.fuel
      })
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
      flightMode: this.flightMode
    })
  }
}
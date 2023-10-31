import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, Waypoint} from "@common/prisma";
import {Route} from "@auto/ship/behaviors/atoms/find-route-to";
import {TaskInterface} from "@auto/ship/task/taskInterface";

export class TravelTask implements TaskInterface {
  name = 'Travel';
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
      //warp to waypoint
      await ship.warp(this.destination.waypointSymbol)
    } else {
      //warp to system
      await ship.warp(this.destination.systemSymbol)
    }
  }
}
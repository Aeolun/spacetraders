import {ShipNavFlightMode} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {prisma, Waypoint} from "@common/prisma";
import {Route} from "@auto/ship/behaviors/atoms/find-route-to";
import {TaskInterface} from "@auto/ship/task/taskInterface";
import {defaultWayfinder} from "@common/default-wayfinder";

export class ExploreTask implements TaskInterface {
  name = 'Explore';
  waypointSymbol: string;

  constructor(waypointSymbol: string) {
    this.waypointSymbol = waypointSymbol;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol === this.waypointSymbol) {
      // go and explore
      const chartResult = await ship.chart();

      const hasShipyard = chartResult.waypoint?.traits.some(
        (t) => t.symbol === "SHIPYARD"
      );
      const hasMarketplace = chartResult.waypoint?.traits.some(
        (t) => t.symbol === "MARKETPLACE"
      );
      if (hasMarketplace || hasShipyard) {
        await ship.dock();
        if (hasMarketplace) {
          await ship.market();
          await ship.attemptRefuel();
        }
        if (hasShipyard) {
          await ship.shipyard();
        }
        await ship.orbit();
      }

      if (chartResult.waypoint?.type === "JUMP_GATE") {
        await ship.jumpgate();
        await defaultWayfinder.addSystemFromDatabase(ship.currentSystem.symbol);
      }
    } else {
      throw new Error(`Not at the location to explore. Need to be at ${this.waypointSymbol} but at ${ship.currentWaypointSymbol}.`)
    }
  }
}
import {Ship} from "@auto/ship/ship";
import {defaultWayfinder} from "@common/default-wayfinder";
import {prisma, TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/task";

export class ExploreTask implements TaskInterface<Ship> {
  type = TaskType.EXPLORE;
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

      if (chartResult.waypoint?.isUnderConstruction) {
        await ship.construction();
      }

      await prisma.waypoint.update({
        where: {
          symbol: ship.currentWaypointSymbol
        },
        data: {
          exploreStatus: 'EXPLORED'
        }
      })
    } else {
      throw new Error(`Not at the location to explore. Need to be at ${this.waypointSymbol} but at ${ship.currentWaypointSymbol}.`)
    }
  }

  serialize(): string {
    return JSON.stringify({
      waypointSymbol: this.waypointSymbol,
    });
  }
}
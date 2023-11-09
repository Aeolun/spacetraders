import {Ship} from "@auto/ship/ship";
import {TaskInterface} from "@auto/ship/task/taskInterface";
import {defaultWayfinder} from "@common/default-wayfinder";
import {prisma, TaskType} from "@common/prisma";

export class UpdateMarketTask implements TaskInterface {
  type = TaskType.UPDATE_MARKET;
  waypointSymbol: string;

  constructor(waypointSymbol: string) {
    this.waypointSymbol = waypointSymbol;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol === this.waypointSymbol) {
      const waypoint = await prisma.waypoint.findUnique({
        where: {
          symbol: this.waypointSymbol
        },
        include: {
          traits: true
        }
      })

      const hasShipyard = waypoint?.traits.some(
        (t) => t.symbol === "SHIPYARD"
      );
      const hasMarketplace = waypoint?.traits.some(
        (t) => t.symbol === "MARKETPLACE"
      );
      if (hasMarketplace || hasShipyard) {
        if (hasMarketplace) {
          await ship.market();
        }
        if (hasShipyard) {
          await ship.shipyard();
        }
      }

      await prisma.waypoint.update({
        where: {
          symbol: ship.currentWaypointSymbol
        },
        data: {
          marketLastUpdated: new Date()
        }
      })
    } else {
      throw new Error(`Not at the location to update market. Need to be at ${this.waypointSymbol} but at ${ship.currentWaypointSymbol}.`)
    }
  }

  serialize(): string {
    return JSON.stringify({
      waypointSymbol: this.waypointSymbol,
    });
  }
}
import {Ship} from "@auto/ship/ship";
import {TaskInterface} from "@auto/ship/task/taskInterface";
import {prisma, TaskType} from "@common/prisma";
import {ShipType} from "spacetraders-sdk";

export class PurchaseShipTask implements TaskInterface {
  type = TaskType.PURCHASE_SHIP;
  waypointSymbol: string;
  shipSymbol: ShipType;
  amount: number;


  constructor(args: {waypointSymbol: string, shipSymbol: ShipType, amount: number}) {
    this.waypointSymbol = args.waypointSymbol;
    this.shipSymbol = args.shipSymbol;
    this.amount = args.amount;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol === this.waypointSymbol) {
      await ship.purchaseShip(this.shipSymbol);
    } else {
      throw new Error(`Not at the location to purchase ship. Need to be at ${this.waypointSymbol} but at ${ship.currentWaypointSymbol}.`)
    }
  }

  serialize(): string {
    return JSON.stringify({
      shipSymbol: this.shipSymbol,
      amount: this.amount,
      waypointSymbol: this.waypointSymbol,
    });
  }
}
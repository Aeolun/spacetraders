import {Ship} from "@auto/ship/ship";

import {prisma, TaskType} from "@common/prisma";
import {ShipType} from "spacetraders-sdk";

import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import z from "zod";
import {constructPayloadSchema} from "@auto/ship/task/construct";

export const purchaseShipPayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema,
  shipSymbol: z.nativeEnum(ShipType),
  amount: z.number(),
})
export class PurchaseShipTask extends AbstractTask {
  type = TaskType.PURCHASE_SHIP;
  expectedPosition: LocationWithWaypointSpecifier
  shipSymbol: ShipType;
  amount: number;


  constructor(args: {expectedPosition: LocationWithWaypointSpecifier, shipSymbol: ShipType, amount: number}) {
    super(TaskType.PURCHASE_SHIP, 1, args.expectedPosition)
    this.expectedPosition = args.expectedPosition
    this.shipSymbol = args.shipSymbol;
    this.amount = args.amount;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol === this.expectedPosition.waypoint.symbol) {
      for(let i = 0; i < this.amount; i++) {
        await ship.purchaseShip(this.shipSymbol);
      }
    } else {
      throw new Error(`Not at the location to purchase ship. Need to be at ${this.expectedPosition.waypoint.symbol} but at ${ship.currentWaypointSymbol}.`)
    }
  }

  serialize(): string {
    return JSON.stringify({
      shipSymbol: this.shipSymbol,
      amount: this.amount,
      expectedPosition: this.expectedPosition,
    } satisfies z.output<typeof purchaseShipPayloadSchema>);
  }
}
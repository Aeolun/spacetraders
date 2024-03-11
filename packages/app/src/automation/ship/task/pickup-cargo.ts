import {TradeSymbol} from "spacetraders-sdk";
import {prisma, TaskType, CargoState} from "@common/prisma";
import {Ship} from "@auto/ship/ship";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {Task} from "@auto/ship/task/task";
import {TaskInterface} from "@auto/strategy/orchestrator/types";
import {AbstractTask} from "@auto/ship/task/abstract-task";
import {Objective} from "@auto/strategy/objective/objective";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {LocationWithWaypointSpecifierSchema} from "@auto/lib/schemas";
import z from "zod";
import {constructPayloadSchema} from "@auto/ship/task/construct";
import axios from "axios";

export const pickupCargoPayloadSchema = z.object({
  expectedPosition: LocationWithWaypointSpecifierSchema,
  tradeGoods: z.array(z.nativeEnum(TradeSymbol)).optional(),
  waitForFullCargo: z.boolean().optional()
})


export class PickupCargoTask extends AbstractTask {
  type = TaskType.PICKUP_CARGO;
  expectedPosition: LocationWithWaypointSpecifier

  constructor(expectedPosition: LocationWithWaypointSpecifier, public tradeGoods?: TradeSymbol[], public waitForFullCargo?: boolean) {
    super(TaskType.PICKUP_CARGO, 1, expectedPosition)
    this.expectedPosition = expectedPosition
  }

  async execute(ship: Ship, orchestrator: Orchestrator<Ship, Task, Objective>) {
    if (ship.currentWaypointSymbol !== this.expectedPosition.waypoint.symbol) {
      throw new Error("Cannot pick up cargo in a place we are not")
    }

    do {
      const otherShipsAtCurrentWaypoint = await prisma.ship.findMany({
        where: {
          currentWaypointSymbol: this.expectedPosition.waypoint.symbol,
          symbol: {
            not: ship.symbol
          },
          cargoState: CargoState.OPEN_PICKUP
        },
        include: {
          cargo: true
        },
      })

      if (otherShipsAtCurrentWaypoint.length === 0) {
        ship.log("No other ships at waypoint, exiting pickup cargo task. WTF did everyone go?", "WARN")
        break;
      }

      const otherShipsWithCargo = otherShipsAtCurrentWaypoint.filter(s => Object.keys(s.cargo).length > 0)

      ship.log(`Found ${otherShipsWithCargo.length} ships with cargo at ${this.expectedPosition.waypoint.symbol}`)
      // make all other ships give me their shit
      top:
      for(const otherShip of otherShipsWithCargo) {
        const otherShipObject = orchestrator.getExecutor(otherShip.symbol)
        if (!otherShipObject) {
          ship.log(`Cannot retrieve executor for ${otherShip.symbol}, retry later`)
          break;
        }

        for(const cargo of Object.keys(otherShipObject.currentCargo)) {
          const tradeSymbol = cargo as TradeSymbol
          if (this.tradeGoods && !this.tradeGoods.includes(tradeSymbol)) {
            continue
          }

          const cargoAmount = otherShipObject.currentCargo[tradeSymbol]
          const maxLoadableUnits = Math.min(cargoAmount, ship.maxCargo - ship.cargo)
          ship.log(`${otherShipObject.symbol} has ${cargoAmount} ${tradeSymbol}, my max ${ship.maxCargo}, current ${ship.cargo}, free space for ${ship.maxCargo - ship.cargo}, max loadable ${maxLoadableUnits}.`)
          if (maxLoadableUnits === 0) {
            break top;
          }

          try {
            await otherShipObject.transferCargo(ship.symbol, tradeSymbol, maxLoadableUnits)
          } catch(e) {
            ship.log(`Failed to transfer cargo from ${otherShipObject.symbol} to ${ship.symbol}, retry later: ${e.toString()}`, "WARN")
            break top;
          }
          await ship.addToCargo(tradeSymbol, maxLoadableUnits)
          ship.log(`Received ${maxLoadableUnits} ${tradeSymbol} from ${otherShipObject.symbol}`)
        }
      }

      await ship.waitFor(30000, "Waiting a bit for other ships to gather cargo.")
    } while(this.waitForFullCargo && ship.cargo < ship.maxCargo)
  }

  serialize(): string {
    return JSON.stringify({
      expectedPosition: this.expectedPosition,
      tradeGoods: this.tradeGoods,
      waitForFullCargo: this.waitForFullCargo
    } satisfies z.output<typeof pickupCargoPayloadSchema>)
  }
}

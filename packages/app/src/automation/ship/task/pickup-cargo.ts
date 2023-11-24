import {TradeSymbol} from "spacetraders-sdk";
import {prisma, TaskType, CargoState} from "@common/prisma";
import {Ship} from "@auto/ship/ship";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {Task, TaskInterface} from "@auto/ship/task/task";

export class PickupCargoTask implements TaskInterface<Ship> {
  type = TaskType.PICKUP_CARGO;

  constructor(public waypointSymbol: string, public tradeGoods?: TradeSymbol[], public waitForFullCargo?: boolean) {}

  async execute(ship: Ship, orchestrator: Orchestrator<Ship, Task>) {
    if (ship.currentWaypointSymbol !== this.waypointSymbol) {
      throw new Error("Cannot pick up cargo in a place we are not")
    }

    do {
      const otherShipsAtCurrentWaypoint = await prisma.ship.findMany({
        where: {
          currentWaypointSymbol: this.waypointSymbol,
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

      // make all other ships give me their shit
      top:
      for(const otherShip of otherShipsWithCargo) {
        const otherShipObject = orchestrator.getExecutor(otherShip.symbol)
        if (!otherShipObject) {
          continue;
        }

        for(const cargo of Object.keys(otherShipObject.currentCargo)) {
          const tradeSymbol = cargo as TradeSymbol
          if (this.tradeGoods && !this.tradeGoods.includes(tradeSymbol)) {
            continue
          }

          const cargoAmount = otherShipObject.currentCargo[tradeSymbol]
          const maxLoadableUnits = Math.min(ship.cargo + cargoAmount, ship.maxCargo - ship.cargo)
          if (maxLoadableUnits === 0) {
            break top;
          }

          await otherShipObject.transferCargo(ship.symbol, tradeSymbol, maxLoadableUnits)
        }
      }
    } while(this.waitForFullCargo && ship.cargo < ship.maxCargo)
  }

  serialize(): string {
    return JSON.stringify({
      waypointSymbol: this.waypointSymbol,
      tradeGoods: this.tradeGoods,
      waitForFullCargo: this.waitForFullCargo
    })
  }
}

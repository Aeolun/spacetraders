import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {ShipType} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {prisma} from "@common/prisma";
import {PurchaseShipTask} from "@auto/ship/task/purchase-ship";

export class PurchaseShipObjective extends AbstractObjective {
  public shipSymbol: ShipType
  public amount: number

  type: ObjectiveType.PURCHASE_SHIP = ObjectiveType.PURCHASE_SHIP;
  priority = 1

  constructor(tradeSymbol: ShipType, amount: number) {
    super(`Purchase ship ${tradeSymbol}`);
    this.shipSymbol = tradeSymbol;
    this.amount = amount;
  }

  async onStarted(ship: Ship): Promise<void> {

  }


  async onCompleted(ship: Ship): Promise<void> {

  }

  appropriateForShip(ship: Ship): boolean {
    return ship.maxCargo >= 35;
  }

  distanceToStart(ship: Ship): number {
    return 0
  }

  async constructTasks(ship: Ship): Promise<void> {
    // todo: Make this actually find the best location to purchase
    const shipPurchaseLocation = await prisma.shipyardModel.findFirstOrThrow({
      where: {
        shipConfigurationSymbol: this.shipSymbol,
      },
      include: {
        waypoint: {
          include: {
            system: true
          }
        },
      }
    })
    
    await ship.addTask(new TravelTask({
      systemSymbol: shipPurchaseLocation.waypoint.system.symbol,
      waypointSymbol: shipPurchaseLocation.waypoint.symbol,
    }))
    await ship.addTask(new PurchaseShipTask({
      waypointSymbol: shipPurchaseLocation.waypoint.symbol,
      shipSymbol: this.shipSymbol,
      amount: 1
    }))

  }
}
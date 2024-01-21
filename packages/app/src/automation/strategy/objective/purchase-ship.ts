import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {ShipType} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {prisma} from "@common/prisma";
import {PurchaseShipTask} from "@auto/ship/task/purchase-ship";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {craftTravelTasks} from "@auto/ship/behaviors/atoms/craft-travel-tasks";

export class PurchaseShipObjective extends AbstractObjective {
  public shipSymbol: ShipType
  public amount: number

  type: ObjectiveType.PURCHASE_SHIP = ObjectiveType.PURCHASE_SHIP;
  priority = 10

  constructor(tradeSymbol: ShipType, amount: number, pricePerShip: number) {
    super(`Purchase ship ${tradeSymbol}`, 'self');
    this.shipSymbol = tradeSymbol;
    this.amount = amount;
    this.creditReservation = amount * pricePerShip
  }

  async onStarted(ship: Ship, executionId: string): Promise<void> {}
  async onCompleted(ship: Ship, executionId: string): Promise<void> {}
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {}

  appropriateFor(ship: Ship): boolean {
    return ship.engineSpeed > 5;
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

    const currentLocation = await waypointLocationFromSymbol(ship.currentWaypointSymbol)
    const purchaseLocation = await waypointLocationFromSymbol(shipPurchaseLocation.waypoint.symbol)
    const travelTasks = await craftTravelTasks(currentLocation, purchaseLocation, {
      speed: ship.engineSpeed,
      maxFuel: ship.maxFuel,
      currentFuel: ship.fuel,
    })
    for(const task of travelTasks) {
      await ship.addTask(task)
    }
    await ship.addTask(new PurchaseShipTask({
      expectedPosition: purchaseLocation,
      shipSymbol: this.shipSymbol,
      amount: this.amount
    }))

  }
}
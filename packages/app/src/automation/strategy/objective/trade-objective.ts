import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {prisma, Waypoint} from '@common/prisma'
import {TradeSymbol} from "spacetraders-sdk";
import {getDistance} from "@common/lib/getDistance";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {SellTask} from "@auto/ship/task/sell";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {craftTravelTasks} from "@auto/ship/behaviors/atoms/craft-travel-tasks";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export class TradeObjective extends AbstractObjective {
  public toWaypoint: LocationWithWaypointSpecifier
  public tradeSymbol: TradeSymbol
  public amount: number
  public minSell: number;
  public maxBuy: number;
  startingLocation: LocationWithWaypointSpecifier
  type: ObjectiveType.TRADE = ObjectiveType.TRADE;

  constructor(fromWaypoint: Waypoint & { system: { symbol: string, x: number, y: number }}, toWaypoint: Waypoint & { system: { symbol: string, x: number, y: number }}, tradeSymbol: TradeSymbol, amount: number, options: {
    minimumSell: number
    maximumBuy: number
    maxShips?: number
    priority?: number
    creditReservation?: number
  }) {
    const location = {
      system: {
        symbol: fromWaypoint.system.symbol,
        x: fromWaypoint.system.x,
        y: fromWaypoint.system.y,
      },
      waypoint: {
        symbol: fromWaypoint.symbol,
        x: fromWaypoint.x,
        y: fromWaypoint.y,
      }
    }
    super(`Trade ${tradeSymbol} from ${fromWaypoint.symbol}`, location);
    this.startingLocation = location;
    this.toWaypoint = {
      system: {
        symbol: toWaypoint.system.symbol,
        x: toWaypoint.system.x,
        y: toWaypoint.system.y,
      },
      waypoint: {
        symbol: toWaypoint.symbol,
        x: toWaypoint.x,
        y: toWaypoint.y,
      }
    };
    this.tradeSymbol = tradeSymbol;
    this.amount = amount;
    this.minSell = options.minimumSell;
    this.maxBuy = options.maximumBuy;
    this.maxShips = options.maxShips ?? 1;
    this.priority = options.priority ?? 0;
    this.creditReservation = options.creditReservation ?? 0;
  }

  async onStarted(ship: Ship, executionId: string): Promise<void> {}
  async onCompleted(ship: Ship, executionId: string): Promise<void> {}
  async onFailed(ship: Ship, error: unknown, executionId: string): Promise<void> {}

  appropriateFor(ship: Ship): boolean {
    return ship.maxCargo >= 35 && ship.cargo === 0;
  }

  async constructTasks(ship: Ship): Promise<void> {
    const currentCargo = ship.currentCargo[this.tradeSymbol] ?? 0;
    const waypoint = await prisma.waypoint.findFirstOrThrow({
      where: {
        symbol: this.startingLocation.waypoint.symbol
      },
      include: {
        tradeGoods: true
      }
    })
    const hasFuel = waypoint.tradeGoods.find((tradeGood) => tradeGood.tradeGoodSymbol === 'FUEL')
    let fuelLeftOver = hasFuel ? ship.maxFuel : ship.fuel
    if (currentCargo < this.amount) {
      const currentLocation = await waypointLocationFromSymbol(ship.currentWaypointSymbol)

      const travelTasks = await craftTravelTasks(currentLocation, this.startingLocation, {
        speed: ship.engineSpeed,
        maxFuel: ship.maxFuel,
        // if there is fuel available at this waypoint, we refuel before we leave
        currentFuel: fuelLeftOver,
      })
      for (const task of travelTasks) {
        await ship.addTask(task)
      }
      await ship.addTask(new PurchaseTask(this.startingLocation, this.tradeSymbol, Math.min(ship.maxCargo - ship.cargo, this.amount - currentCargo), this.maxBuy))
      fuelLeftOver = travelTasks[travelTasks.length - 1]?.fuelAfter ?? ship.fuel
    }
    const tradeTravelTasks = await craftTravelTasks(this.startingLocation, this.toWaypoint, {
      speed: ship.engineSpeed,
      maxFuel: ship.maxFuel,
      currentFuel: fuelLeftOver,
    })
    for(const task of tradeTravelTasks) {
      await ship.addTask(task)
    }
    await ship.addTask(new SellTask(this.toWaypoint, this.tradeSymbol, Math.min(ship.maxCargo-ship.cargo, this.amount), this.minSell))

  }
}
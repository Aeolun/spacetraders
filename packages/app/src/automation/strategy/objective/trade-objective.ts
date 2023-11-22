import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { Waypoint } from '@common/prisma'
import {TradeSymbol} from "spacetraders-sdk";
import {undefined} from "zod";
import {getDistance} from "@common/lib/getDistance";
import {Ship} from "@auto/ship/ship";
import {TravelTask} from "@auto/ship/task/travel";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {SellTask} from "@auto/ship/task/sell";

export class TradeObjective extends AbstractObjective {
  public fromWaypoint: Waypoint & { system: { symbol: string, x: number, y: number }}
  public toWaypoint: Waypoint & { system: { symbol: string, x: number, y: number }}
  public tradeSymbol: TradeSymbol
  public amount: number
  public minSell: number;
  public maxBuy: number;


  type: ObjectiveType.TRADE = ObjectiveType.TRADE;

  constructor(fromWaypoint: Waypoint & { system: { symbol: string, x: number, y: number }}, toWaypoint: Waypoint & { system: { symbol: string, x: number, y: number }}, tradeSymbol: TradeSymbol, amount: number, options: {
    minimumSell: number
    maximumBuy: number
  }) {
    super(`Trade ${tradeSymbol} from ${fromWaypoint.symbol}`);
    this.fromWaypoint = fromWaypoint;
    this.toWaypoint = toWaypoint;
    this.tradeSymbol = tradeSymbol;
    this.amount = amount;
    this.minSell = options.minimumSell;
    this.maxBuy = options.maximumBuy;
  }

  async onStarted(ship: Ship): Promise<void> {

  }


  async onCompleted(ship: Ship): Promise<void> {

  }

  appropriateForShip(ship: Ship): boolean {
    return ship.maxCargo >= 35;
  }

  distanceToStart(ship: Ship): number {
    if (ship.currentSystemSymbol === this.fromWaypoint.systemSymbol) {
      return getDistance(ship.currentWaypoint, this.fromWaypoint)
    } else {
      return getDistance(ship.currentSystem, this.fromWaypoint.system)
    }
  }

  async constructTasks(ship: Ship): Promise<void> {
    await ship.addTask(new TravelTask({
      systemSymbol: this.fromWaypoint.systemSymbol,
      waypointSymbol: this.fromWaypoint.symbol,
    }))
    await ship.addTask(new PurchaseTask({
      systemSymbol: this.fromWaypoint.systemSymbol,
      waypointSymbol: this.fromWaypoint.symbol,
    }, this.tradeSymbol, Math.min(ship.maxCargo-ship.cargo, this.amount), this.maxBuy))
    await ship.addTask(new TravelTask({
      systemSymbol: this.toWaypoint.systemSymbol,
      waypointSymbol: this.toWaypoint.symbol,
    }))
    await ship.addTask(new SellTask({
      systemSymbol: this.toWaypoint.systemSymbol,
      waypointSymbol: this.toWaypoint.symbol,
    }, this.tradeSymbol, Math.min(ship.maxCargo-ship.cargo, this.amount), this.minSell))

  }
}
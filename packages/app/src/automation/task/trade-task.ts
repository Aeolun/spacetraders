import {AbstractTask, TaskType} from "@auto/task/abstract-task";
import { Waypoint } from '@auto/prisma'
import {TradeSymbol} from "spacetraders-sdk";

export class TradeTask extends AbstractTask {
  public fromWaypoint: Waypoint
  public toWaypoint: Waypoint
  public tradeSymbol: TradeSymbol
  public amount: number

  type: TaskType.TRADE = TaskType.TRADE;

  constructor(fromWaypoint: Waypoint, toWaypoint: Waypoint, tradeSymbol: TradeSymbol, amount: number) {
    super(`Trade ${amount} ${tradeSymbol} from ${fromWaypoint.symbol} to ${toWaypoint.symbol}`);
    this.fromWaypoint = fromWaypoint;
    this.toWaypoint = toWaypoint;
    this.tradeSymbol = tradeSymbol;
    this.amount = amount;
  }
}
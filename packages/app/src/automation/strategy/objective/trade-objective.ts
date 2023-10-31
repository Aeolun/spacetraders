import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { Waypoint } from '@common/prisma'
import {TradeSymbol} from "spacetraders-sdk";

export class TradeObjective extends AbstractObjective {
  public fromWaypoint: Waypoint
  public toWaypoint: Waypoint
  public tradeSymbol: TradeSymbol
  public amount: number

  type: ObjectiveType.TRADE = ObjectiveType.TRADE;

  constructor(fromWaypoint: Waypoint, toWaypoint: Waypoint, tradeSymbol: TradeSymbol, amount: number) {
    super(`Trade ${amount} ${tradeSymbol} from ${fromWaypoint.symbol} to ${toWaypoint.symbol}`);
    this.fromWaypoint = fromWaypoint;
    this.toWaypoint = toWaypoint;
    this.tradeSymbol = tradeSymbol;
    this.amount = amount;
  }
}
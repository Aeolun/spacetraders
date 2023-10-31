import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { System, Waypoint } from '@common/prisma'

export class UpdateMarketDataObjective extends AbstractObjective {
  public system: System
  public waypoint: Waypoint

  type: ObjectiveType.UPDATE_MARKET = ObjectiveType.UPDATE_MARKET;

  constructor(system: System, waypoint: Waypoint) {
    super(`Update market data for ${waypoint.symbol}`);
    this.system = system;
    this.waypoint = waypoint;
  }
}
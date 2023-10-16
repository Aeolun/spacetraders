import {AbstractTask, TaskType} from "@auto/task/abstract-task";
import { System, Waypoint } from '@auto/prisma'

export class UpdateMarketData extends AbstractTask {
  public system: System
  public waypoint: Waypoint

  type: TaskType.UPDATE_MARKET = TaskType.UPDATE_MARKET;

  constructor(system: System, waypoint: Waypoint) {
    super(`Update market data for ${waypoint.symbol}`);
    this.system = system;
    this.waypoint = waypoint;
  }
}
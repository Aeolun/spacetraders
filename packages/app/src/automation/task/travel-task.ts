import {AbstractTask, TaskType} from "@auto/task/abstract-task";
import { System } from '@common/prisma'
import {Waypoint} from "spacetraders-sdk";

export class TravelTask extends AbstractTask {
  type: TaskType.TRAVEL = TaskType.TRAVEL;

  constructor(public system: System, public waypoint?: Waypoint) {
    super(`Travel to ${waypoint ? waypoint.symbol : system.symbol}`);
  }
}
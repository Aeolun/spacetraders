import {AbstractTask, TaskType} from "@auto/task/abstract-task";
import { System } from '@common/prisma'

export class ExploreTask extends AbstractTask {
  public system: System
  type: TaskType.EXPLORE = TaskType.EXPLORE;

  constructor(system: System) {
    super(`Explore ${system.symbol}`);
    this.system = system;
  }
}
import {TaskType} from "@auto/task/abstractTask";
import {Orchestrator} from "@auto/strategy/orchestrator";

export class TaskPopulator {
  private allowedTasks: TaskType[] = [];

  constructor(private orchestrator: Orchestrator) {}

  public addPossibleTask(taskType: TaskType) {
    this.allowedTasks.push(taskType);
  }

  public populateTasks() {
    // read through current universe state and updates available tasks
  }
}
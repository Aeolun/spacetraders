import {Task, TaskInterface} from "@auto/ship/task/task";
import {Objective} from "@auto/strategy/objective/objective";

export interface TaskExecutor<TaskType extends TaskInterface<unknown>, O extends Objective> {
  symbol: string;
  taskQueueLength: number;
  currentObjective: string | undefined;
  prepare(): Promise<void>;
  getNextTask(): Promise<TaskType | undefined>;
  getPersonalObjective(): O | undefined;
  finishedTask(): Promise<void>;
  clearTaskQueue(): Promise<void>;
  setObjective(objective: string): Promise<void>;

  onNothingToDo(): Promise<void>;
  onTaskStarted(task: TaskType): Promise<void>;
  onObjectiveStarted(objective: O): Promise<void>;
  onObjectiveCompleted(): Promise<void>;
  onObjectiveFailed(objective: O, e: unknown): Promise<void>;
  onTaskFailed(task: TaskType, e: unknown): Promise<void>;
}
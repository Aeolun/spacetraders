import {Orchestrator} from "@auto/strategy/orchestrator";

export interface TaskExecutor<TaskType extends TaskInterface = TaskInterface, O extends ObjectiveInterface = ObjectiveInterface, Pos = Position> {
  symbol: string;
  taskQueueLength: number;
  currentObjective: string | undefined;
  nextObjective: string | undefined;
  currentExecutionId: string | undefined;
  nextExecutionId: string | undefined;


  getExpectedFreeTime(): number;
  getExpectedPosition(): Pos;

  prepare(): Promise<void>;

  addTask(task: TaskType): Promise<void>;

  getNextTask(): Promise<TaskType | undefined>;

  getPersonalObjective(): O | undefined;

  finishedTask(): Promise<void>;

  clearTaskQueue(): Promise<void>;

  onNothingToDo(reason?: string): Promise<void>;
  clearObjectives(): Promise<void>;
  onTaskStarted(task: TaskType): Promise<void>;

  onStartNextObjective(): Promise<void>;
  onObjectiveAssigned(objective: O, executionId: string, which?: 'current' | 'next'): Promise<void>;
  onObjectiveStarted(objective: O, executionId: string): Promise<void>;
  onObjectiveCancelled(which?: 'current' | 'next'): Promise<void>;
  onExecutorException(error: Error): Promise<void>;

  onObjectiveCompleted(executionId: string): Promise<void>;

  onObjectiveFailed(e: unknown, executionId: string): Promise<void>;

  onTaskFailed(task: TaskType, e: unknown): Promise<void>;
}

export interface Position {
  waypointSymbol: string
  systemSymbol: string;
}

export interface TaskInterface<EX extends TaskExecutor<any, any> = TaskExecutor<any, any>, Pos = Position> {
  type: string;
  expectedDuration: number;
  expectedPosition: Pos

  execute(executor: EX, orchestrator?: Orchestrator<EX, TaskInterface, ObjectiveInterface>): Promise<void>;

  serialize(): string;
}

export interface ObjectiveInterface<Pos = Position> {
  objective: string
  isPersistent: boolean
  type: string
  priority: number
  maxShips: number
  creditReservation: number
  startingLocation: Pos

  onStarted(executor: TaskExecutor, executionId: string): Promise<void>
  onCompleted(executor: TaskExecutor, executionId: string): Promise<void>
  onFailed(executor: TaskExecutor, error: unknown, executionId: string): Promise<void>
  appropriateFor(executor: TaskExecutor): boolean
  constructTasks(exector: TaskExecutor): Promise<void>
}
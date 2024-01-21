import {ObjectiveInterface, TaskExecutor, TaskInterface} from "@auto/strategy/orchestrator/types";

export class MockObjective implements ObjectiveInterface {
  type = "mock"
  priority = 0
  objective = "mock"
  isPersistent = false
  maxShips = 1
  position: {
    x: number
    y: number
  }
  creditReservation = 0
  appropriateMock?: (executor: TaskExecutor) => boolean

  constructor(data: {
    type: string
    position: {
      x: number
      y: number
    }
    priority?: number
    maxShips?: number
    isPersistent?: boolean
    appropriateMock?: () => boolean
    creditReservation?: number
  }) {
    this.objective = `${data.type}-${data.position.x}-${data.position.y}`
    this.type = data.type
    this.position = data.position
    if (data.priority) {
      this.priority = data.priority
    }
    if (data.maxShips) {
      this.maxShips = data.maxShips
    }
    if (data.isPersistent) {
      this.isPersistent = data.isPersistent
    }
    if (data.creditReservation) {
      this.creditReservation = data.creditReservation
    }
    if (data.appropriateMock) {
      this.appropriateMock = data.appropriateMock
    }
  }

  async onStarted(executor: any): Promise<void> {
  }

  async onCompleted(executor: any): Promise<void> {
  }

  async onFailed(executor: any): Promise<void> {
    
  }

  appropriateFor(executor: TaskExecutor): boolean {
    return this.appropriateMock?.(executor) ?? true;
  }

  async constructTasks(executor: TaskExecutor): Promise<void> {
    return executor.addTask(new MockTask({
      type: this.type
    }))
  }
}

export class MockExecutor implements TaskExecutor<any, any> {
	symbol: string;
	currentObjective: string | undefined;
  nextObjective: string | undefined;
	tasks: any[] = [];
  position: {
    x: number
    y: number
  }
  currentExecutionId: string | undefined;

  constructor(symbol: string, position: {
    x: number
    y: number
  }) {
    this.symbol = symbol
    this.position = position
  }
	async prepare(): Promise<void> {}

  get taskQueueLength() {
    return this.tasks.length
  }

  async executeNextTask(): Promise<void> {
    if (this.tasks.length === 0) {
      return undefined;
    }
    this.tasks.shift();
  }

	async getNextTask(): Promise<any | undefined> {
		if (this.tasks.length === 0) {
			return undefined;
		}
		return this.tasks[0];
	}

	getPersonalObjective(): MockObjective | undefined {
		return undefined;
	}

	async finishedTask(): Promise<void> {
    this.tasks.shift();
  }

	async addTask(task: any): Promise<void> {
		this.tasks.push(task);
	}

	async clearTaskQueue(): Promise<void> {
		this.tasks = [];
	}

	async setObjective(objective: string): Promise<void> {
		this.currentObjective = objective;
	}

  async setNextObjective(objective: string): Promise<void> {
    this.nextObjective = objective;

  }

	async onNothingToDo(): Promise<void> {}

	async onTaskStarted(task: any): Promise<void> {}

	async onObjectiveStarted(objective: any): Promise<void> {}

	async onObjectiveCompleted(): Promise<void> {}

	async onObjectiveFailed(objective: any, e: unknown): Promise<void> {}

	async onTaskFailed(task: any, e: unknown): Promise<void> {}
}

export class MockTask implements TaskInterface<MockExecutor> {
  type = "mock"

  constructor(data: {
    type: string
  }) {
    this.type = data.type
  }

  async execute(executor: any): Promise<void> {
  }

  serialize(): string {
    return "";
  }
}

export const mockGetDistance = (a: MockExecutor, b: MockObjective) => {
  //euclidean distance
  return Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2))
}

export enum TaskType {
  EXPLORE = 'explore',
  TRADE = 'trade',
  MINE = 'mine',
  TRAVEL = 'travel',
  UPDATE_MARKET = 'update-market',
}
export abstract class AbstractTask {
  public objective: string;
  public priority: number = 0;
  constructor(objective: string, priority: number = 0) {
    this.objective = objective;
    this.priority = priority;
  }
}
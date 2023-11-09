import {Ship} from "@auto/ship/ship";

export enum ObjectiveType {
  EXPLORE = 'explore',
  TRADE = 'trade',
  MINE = 'mine',
  TRAVEL = 'travel',
  UPDATE_MARKET = 'update-market',
  PURCHASE_SHIP = 'purchase-ship',
}
export abstract class AbstractObjective {
  public objective: string;
  public priority: number = 0;
  constructor(objective: string, priority: number = 0) {
    this.objective = objective;
    this.priority = priority;
  }

  abstract appropriateForShip(ship: Ship): boolean
  abstract distanceToStart(ship: Ship): number

  abstract onStarted(ship: Ship): Promise<void>
  abstract constructTasks(ship: Ship): Promise<void>
  abstract onCompleted(ship: Ship): Promise<void>
}
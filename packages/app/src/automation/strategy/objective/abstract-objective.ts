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
  /**
   * Means this objective does not disappear if a ship picks it up (multiple ships can take up this objective).
   * The objective will only disappear if the populator removes it.
   */
  public isPersistent: boolean = false;
  /**
   * The maximum number of ships that can take up this objective.
   */
  public maxShips: number = 1;
  public shipsAssigned: string[] = [];
  public requiredShipSymbols: string[] = [];
  constructor(objective: string, priority: number = 0) {
    this.objective = objective;
    this.priority = priority;
  }

  addShip(shipSymbol: string) {
    this.shipsAssigned.push(shipSymbol);
  }

  abstract appropriateForShip(ship: Ship): boolean
  abstract distanceToStart(ship: Ship): number

  abstract onStarted(ship: Ship): Promise<void>
  abstract constructTasks(ship: Ship): Promise<void>
  abstract onCompleted(ship: Ship): Promise<void>
}
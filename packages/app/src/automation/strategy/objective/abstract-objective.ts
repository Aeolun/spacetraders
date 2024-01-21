import {ObjectiveInterface, TaskExecutor} from "@auto/strategy/orchestrator/types";
import {Location} from "@auto/strategy/types";

export enum ObjectiveType {
  EXPLORE = 'explore',
  TRADE = 'trade',
  EMPTY_CARGO = 'empty-cargo',
  PICKUP_CARGO = 'pickup-cargo',
  MINE = 'mine',
  SURVEY = 'survey',
  SIPHON = 'siphon',
  TRAVEL = 'travel',
  UPDATE_MARKET = 'update-market',
  PURCHASE_SHIP = 'purchase-ship',
  CONSTRUCT = 'construct'
}

export abstract class AbstractObjective implements ObjectiveInterface<Location> {
  abstract type: ObjectiveType;
  public objective: string;
  public priority = 0;

  /**
   * Means this objective does not disappear if a ship picks it up (multiple ships can take up this objective).
   * The objective will only disappear if the populator removes it.
   */
  public isPersistent = false;
  /**
   * The maximum number of ships that can take up this objective.
   */
  public maxShips = 1;
  public shipsAssigned: string[] = [];
  public requiredShipSymbols: string[] = [];
  public startingLocation: Location;
  public creditReservation = 0;
  constructor(objective: string, startingLocation: Location, priority = 0, options?: {
    creditReservation?: number
  }) {
    this.objective = objective;
    this.startingLocation = startingLocation;
    this.priority = priority;
    this.creditReservation = options?.creditReservation ?? 0;
  }

  addShip(shipSymbol: string) {
    this.shipsAssigned.push(shipSymbol);
  }

  abstract appropriateFor(ship: TaskExecutor): boolean
  abstract onStarted(ship: TaskExecutor, executionId: string): Promise<void>
  abstract constructTasks(ship: TaskExecutor): Promise<void>
  abstract onCompleted(ship: TaskExecutor, executionId: string): Promise<void>
  abstract onFailed(ship: TaskExecutor, error: unknown, executionId: string): Promise<void>
}
import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {Ship} from "@auto/ship/ship";
import {Objective} from "@auto/strategy/objective/objective";
import {Task} from "@auto/ship/task/task";
import {EmptyCargoObjective} from "@auto/strategy/objective/empty-cargo-objective";

export class Orchestrator {
  private objectives: Record<string, Objective> = {};
  private objectiveIds: Record<string, boolean> = {};
  private ships: Ship[] = [];

  constructor() {

  }

  getObjectiveCount() {
    return Object.keys(this.objectives).length;
  }

  public getObjectives() {
    return Object.values(this.objectives)
  }

  addObjective(task: Objective) {
    if (this.objectiveIds[task.objective]) {
      return;
    }
    this.objectiveIds[task.objective] = true;
    this.objectives[task.objective] = task;
  }

  addOrUpdateObjective(task: Objective) {
    this.objectiveIds[task.objective] = true;
    this.objectives[task.objective] = task;
  }

  getShip(symbol: string) {
    return this.ships.find(s => s.symbol === symbol)
  }

  public getSortedObjectives(ship: Ship) {
    const shipObjectives = Object.values(this.objectives).filter(o => o.appropriateForShip(ship))
    shipObjectives.sort((a, b) => {
      if (a.priority !== b.priority) {
        //higher priority first
        return b.priority - a.priority;
      }
      return a.distanceToStart(ship) - b.distanceToStart(ship);
    });
    return shipObjectives;
  }

  async getNextObjective(ship: Ship): Promise<Objective | undefined> {
    // we do not expect to have cargo left after finishing the task queue
    if (ship.hasMoreThanExpectedCargo()) {
      ship.log("Ship has more cargo than expected, next objective is getting rid of it.")
      return new EmptyCargoObjective(ship.symbol);
    }

    const shipObjectives = this.getSortedObjectives(ship);
    console.log(shipObjectives.slice(0, 10).map(o => o.objective + ` P${o.priority} (` + o.distanceToStart(ship)+' LY)'))

    let newObjective: Objective | undefined;
    // only do if in same system

    if (shipObjectives.length > 0) {
      newObjective = shipObjectives[0];
    }
    if (newObjective) {
      delete this.objectives[newObjective.objective]
      return newObjective
    }
    return undefined;
  }

  public hasShip(symbol: string) {
    return !!this.ships.find(es => es.symbol === symbol)
  }

  async addShip(ship: Ship) {
    if (this.hasShip(ship.symbol)) {
      console.log("Ship already added")
      return;
    }
    this.ships.push(ship);

    // prepare to run the loop for this ship
    if (ship.navigationUntil && new Date(ship.navigationUntil).getTime() > Date.now()) {
      console.log(`Waiting for ship ${ship.symbol} to finish navigation before starting behavior loop`)
      await ship.waitUntil(ship.navigationUntil)
    }

    while (true) {
      let nextTask: Task | undefined
      if (ship.taskQueueLength > 0) {
        ship.log("Taking up next task in my queue")
        nextTask = await ship.getNextTask();
        if (nextTask) {
          try {
            ship.log(`Executing ${nextTask.type}`)
            await nextTask.execute(ship)
            await ship.finishedTask()
          } catch (e) {
            await ship.clearTaskQueue();
            await ship.waitFor(10000, `Error while executing task ${nextTask.type}: ${e instanceof Error ? e.message : e?.toString()}`)
          }
        } else {
          ship.log("Objective complete")
          ship.setOverallGoal('');
        }
      } else {
        let nextObjective: Objective | undefined

        ship.log("Looking for next objective")
        nextObjective = await this.getNextObjective(ship)

        if (!nextObjective) {
          await ship.waitFor(20000, "No task available for ship");
        } else {
          try {
            await nextObjective.onStarted(ship);
            ship.setOverallGoal(nextObjective.objective)

            await nextObjective.constructTasks(ship);

            ship.log(`Tasks for execution of ${nextObjective.objective} added to ship queue`)
          } catch (e) {
            console.error(e);
            await ship.waitFor(10000, `Error while adding tasks for objective ${nextObjective.type}`);
          }
        }

      }

    }
  }
}
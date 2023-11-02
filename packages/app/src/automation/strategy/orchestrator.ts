import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {Ship} from "@auto/ship/ship";
import {executeExploreTask} from "@auto/ship/behaviors/execute-explore-task";
import {Objective} from "@auto/strategy/objective/objective";
import {Task} from "@auto/ship/task/task";

export class Orchestrator {
  private objectives: Objective[] = [];
  private objectiveIds: Record<string, boolean> = [];
  private ships: Ship[] = [];

  constructor() {

  }

  getObjectiveCount() {
    return this.objectives.length;
  }

  addObjective(task: Objective) {
    if (this.objectiveIds[task.objective]) {
      return;
    }
    this.objectiveIds[task.objective] = true;
    this.objectives.push(task);
  }

  async getNextObjective(ship: Ship): Promise<Objective | undefined> {
    const shipObjectives = this.objectives.filter(o => o.appropriateForShip(ship))
    shipObjectives.sort((a, b) => {
      return a.distanceToStart(ship) - b.distanceToStart(ship);
    });
    console.log(shipObjectives.slice(0, 10).map(o => o.objective + " (" + o.distanceToStart(ship)+' LY)'))

    let newObjective: Objective | undefined;
    // only do if in same system

    if (shipObjectives.length > 0 && shipObjectives[0].distanceToStart(ship) <= 0) {
      newObjective = shipObjectives[0];
    }
    if (newObjective) {
      this.objectives = this.objectives.filter(o => o.objective !== newObjective?.objective);
      return newObjective
    }
    return undefined;
  }

  async addShip(ship: Ship) {
    this.ships.push(ship);
    while(true) {
      let nextTask: Task | undefined
      if (ship.taskQueue.length > 0) {
        ship.log("Taking up next task in my queue")
        nextTask = ship.taskQueue.shift()
        if (nextTask) {
          await nextTask.execute(ship)
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
            ship.setOverallGoal(nextObjective.objective)
            if (nextObjective.type === ObjectiveType.EXPLORE) {
              await nextObjective.constructTasks(ship);
            } else if (nextObjective.type === ObjectiveType.TRADE) {
              await ship.waitFor(20000, "Trade objective not implemented yet");
            } else if (nextObjective.type === ObjectiveType.UPDATE_MARKET) {
              await ship.waitFor(20000, "Update market objective not implemented yet");
            }
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
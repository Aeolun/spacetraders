import {TaskType} from "@auto/task/abstract-task";
import {Ship} from "@auto/ship/ship";
import {executeExploreTask} from "@auto/ship/behaviors/execute-explore-task";
import {Task} from "@auto/task/task";

export class Orchestrator {
  private tasks: Task[] = [];
  private ships: Ship[] = [];

  constructor() {

  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  getNextTask(ship: Ship) {
    return this.tasks.pop();
  }

  async addShip(ship: Ship) {
    this.ships.push(ship);
    while(true) {
      const nextTask = this.getNextTask(ship)

      if (!nextTask) {
        await ship.waitFor(20000, "No task available for ship");
      } else {
        try {
          ship.setOverallGoal(nextTask.objective)
          if (nextTask.type === TaskType.EXPLORE) {
            await executeExploreTask(ship, nextTask);
          } else if (nextTask.type === TaskType.TRADE) {
            await ship.waitFor(20000, "Trade task not implemented yet");
          } else if (nextTask.type === TaskType.UPDATE_MARKET) {
            await ship.waitFor(20000, "Update market task not implemented yet");
          }
        } catch (e) {
          console.error(e);
          await ship.waitFor(10000, `Error while executing task ${nextTask.type}`);
        }
      }
    }
  }
}
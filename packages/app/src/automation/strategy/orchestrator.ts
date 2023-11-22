import {Ship} from "@auto/ship/ship";
import {Objective} from "@auto/strategy/objective/objective";
import {Task, TaskInterface} from "@auto/ship/task/task";
import {EmptyCargoObjective} from "@auto/strategy/objective/empty-cargo-objective";
import {prisma} from "@common/prisma";
import {environmentVariables} from "@common/environment-variables";
import {TaskExecutor} from "@auto/strategy/task-executor";



export class Orchestrator<E extends TaskExecutor<TT, Objective>, TT extends TaskInterface<E>> {
  private objectives: Objective[] = [];
  private objectiveIds: Record<string, boolean> = {};
  private executingObjectives: string[] = [];
  private executorsAssignedToObjective: Record<string, string[]> = {};
  private executors: E[] = [];

  constructor() {

  }

  async loadObjectives() {
    const ships = await prisma.ship.findMany({
      where: {
        agent: environmentVariables.agentName
      }
    })
    this.executingObjectives = ships.map(s => s.overalGoal).filter(g => !!g) as string[]
    // set executors assigned to objectives
    for (const ship of ships) {
      if (ship.overalGoal) {
        if (!this.executorsAssignedToObjective[ship.overalGoal]) {
          this.executorsAssignedToObjective[ship.overalGoal] = []
        }
        this.executorsAssignedToObjective[ship.overalGoal].push(ship.symbol)
      }
    }
  }

  getObjectiveCount() {
    return Object.keys(this.objectives).length;
  }

  getExecutingObjectiveCount() {
    return this.executingObjectives.length;
  }

  public getObjectives() {
    return Object.values(this.objectives)
  }

  addObjectiveIfNotExists(task: Objective) {
    if (this.objectiveIds[task.objective] || this.executingObjectives.includes(task.objective)) {
      return;
    }
    this.objectiveIds[task.objective] = true;
    this.objectives.push(task);
  }

  addOrUpdateObjective(task: Objective) {
    if (this.executingObjectives.includes(task.objective)) {
      return;
    }
    this.objectiveIds[task.objective] = true;
    // replace existing objective
    this.objectives.splice(this.objectives.findIndex(t => t.objective === task.objective), 1, task);
  }

  getExecutor(symbol: string) {
    return this.executors.find(s => s.symbol === symbol)
  }

  public getSortedObjectives(ship: E) {
    const shipObjectives = Object.values(this.objectives).filter(o => o.shipsAssigned.length < o.maxShips).filter(o => o.appropriateForShip(ship))
    shipObjectives.sort((a, b) => {
      if (a.priority !== b.priority) {
        //higher priority first
        return b.priority - a.priority;
      }
      return a.distanceToStart(ship) - b.distanceToStart(ship);
    });
    return shipObjectives;
  }

  async getNextObjective(executor: E): Promise<Objective | undefined> {
    const personalObjective = executor.getPersonalObjective();
    if (personalObjective) {
      console.log("Running personal objective", personalObjective)
      return personalObjective;
    }

    const shipObjectives = this.getSortedObjectives(executor);
    console.log('possible objectives', shipObjectives.slice(0, 10).map(o => o.objective + ` P${o.priority} (` + o.distanceToStart(executor)+' LY)'))

    let newObjective: Objective | undefined;
    // only do if in same system

    if (shipObjectives.length > 0) {
      newObjective = shipObjectives[0];
    }
    if (newObjective) {
      if (!newObjective.isPersistent) {
        // remove from available objectives
        this.objectiveIds[newObjective.objective] = false;
        this.objectives.splice(this.objectives.findIndex(o => o.objective === newObjective?.objective), 1)
      } else {
        // add ship to shipsAssignedToObjectives
        if (!this.executorsAssignedToObjective[newObjective.objective]) {
          this.executorsAssignedToObjective[newObjective.objective] = []
        }
        this.executorsAssignedToObjective[newObjective.objective].push(executor.symbol)
      }
      return newObjective
    }
    return undefined;
  }

  public hasExecutor(symbol: string) {
    return !!this.executors.find(es => es.symbol === symbol)
  }

  async addExecutor(executor: E) {
    if (this.hasExecutor(executor.symbol)) {
      console.log("Ship already added")
      return;
    }
    this.executors.push(executor);

    // prepare to run the loop for this ship
    await executor.prepare();

    while (true) {
      let nextTask: TT | undefined
      if (executor.taskQueueLength > 0) {
        nextTask = await executor.getNextTask();
        if (nextTask) {
          try {
            await executor.onTaskStarted(nextTask)

            await nextTask.execute(executor)
            await executor.finishedTask()
          } catch (e) {
            await executor.clearTaskQueue();
            console.log(`Removing objective ${executor.currentObjective} from executing objectives`)
            this.executingObjectives = this.executingObjectives.filter(o => o !== executor.currentObjective)
            await executor.setObjective('');
            await executor.onTaskFailed(nextTask, e)
          }
        }

        if (executor.taskQueueLength === 0) {
          await executor.onObjectiveCompleted()

          console.log(`Removing objective ${executor.currentObjective} from executing objectives`)
          this.executingObjectives = this.executingObjectives.filter(o => o !== executor.currentObjective)
          // remove ship from ships assigned to it
          if (executor.currentObjective && this.executorsAssignedToObjective[executor.currentObjective]) {
            this.executorsAssignedToObjective[executor.currentObjective] = this.executorsAssignedToObjective[executor.currentObjective].filter(s => s !== executor.symbol)
          }
          await executor.setObjective('');
        }
      } else {
        let nextObjective: Objective | undefined

        nextObjective = await this.getNextObjective(executor)

        if (!nextObjective) {
          await executor.onNothingToDo();

        } else {
          try {
            await nextObjective.onStarted(executor);
            this.executingObjectives.push(nextObjective.objective)
            await executor.setObjective(nextObjective.objective)

            await nextObjective.constructTasks(executor);

            await executor.onObjectiveStarted(nextObjective);
          } catch (e) {
            console.error(e);
            await executor.onObjectiveFailed(nextObjective, e)
          }
        }

      }

    }
  }
}
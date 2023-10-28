import {TaskType} from "@auto/task/abstract-task";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {prisma} from "@common/prisma";
import {ExploreTask} from "@auto/task/explore-task";

export class TaskPopulator {
  private allowedTasks: TaskType[] = [];

  constructor(private orchestrator: Orchestrator) {}

  public addPossibleTask(taskType: TaskType) {
    this.allowedTasks.push(taskType);
  }

  public async populateTasks() {
    // read through current universe state and updates available tasks

    if (this.allowedTasks.includes(TaskType.EXPLORE)) {
      // find unexplored systems
      // create explore tasks for them
      const systemsWithUnchartedWaypointsOrMarketplace = await prisma.system.findMany({
        where: {
          waypoints: {
            some: {
              OR: [
                {
                  traits: {
                    some: {
                      symbol: "UNCHARTED"
                    }
                  }
                },
                {
                  traits: {
                    some: {
                      symbol: "MARKETPLACE"
                    }
                  },
                  tradeGoods: {
                    none: {
                      purchasePrice: {
                        gt: 0
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      });
      if (systemsWithUnchartedWaypointsOrMarketplace.length > 0) {
        for (const system of systemsWithUnchartedWaypointsOrMarketplace) {
          this.orchestrator.addTask(new ExploreTask(system));
        }
      }
    }
  }
}
import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {prisma} from "@common/prisma";
import {ExploreObjective} from "@auto/strategy/objective/explore-objective";

export class TaskPopulator {
  private allowedTasks: ObjectiveType[] = [];

  constructor(private orchestrator: Orchestrator) {}

  public addPossibleTask(taskType: ObjectiveType) {
    this.allowedTasks.push(taskType);
  }

  public async populateTasks() {
    // read through current universe state and updates available tasks

    if (this.allowedTasks.includes(ObjectiveType.EXPLORE)) {
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
          this.orchestrator.addTask(new ExploreObjective(system));
        }
      }
    }
  }
}
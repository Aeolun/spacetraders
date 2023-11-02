import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {prisma, ExploreStatus} from "@common/prisma";
import {ExploreObjective} from "@auto/strategy/objective/explore-objective";

export class ObjectivePopulator {
  private allowedObjectives: ObjectiveType[] = [];

  constructor(private orchestrator: Orchestrator) {}

  public addPossibleObjective(taskType: ObjectiveType) {
    this.allowedObjectives.push(taskType);
  }

  public async populateObjectives() {
    // read through current universe state and updates available tasks

    if (this.allowedObjectives.includes(ObjectiveType.EXPLORE)) {
      // find unexplored systems
      // create explore tasks for them
      const systemsWithUnchartedWaypointsOrMarketplace = await prisma.system.findMany({
        where: {
          exploreStatus: ExploreStatus.UNEXPLORED,
          waypointsRetrieved: true
        }
      });
      console.log("Found systems with uncharted waypoints or marketplaces", systemsWithUnchartedWaypointsOrMarketplace.length)
      if (systemsWithUnchartedWaypointsOrMarketplace.length > 0) {
        for (const system of systemsWithUnchartedWaypointsOrMarketplace) {
          this.orchestrator.addObjective(new ExploreObjective(system));
        }
      }
    }
  }
}
import {prisma} from "@common/prisma";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {ObjectivePopulator} from "@auto/strategy/objective-populator";
import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {APIInstance} from "@common/lib/createApi";
import {startShipBehavior} from "@auto/strategy/ship-behavior";
import {environmentVariables} from "@common/environment-variables";

let stage = 0;
export async function initGlobalBehavior(orchestrator: Orchestrator, taskPopulator: ObjectivePopulator, api: APIInstance) {
  let agent = await getBackgroundAgent();

  if (!agent.headquartersSymbol) {
    throw new Error("Agent does not have headquarters symbol")
  }

  let homeWaypoint = await prisma.waypoint.findFirstOrThrow({
    where: {
      symbol: agent.headquartersSymbol,
    },
    include: {
      system: true,
    },
  });
  let homeSystem = homeWaypoint.system;
  let hasUnexploredHomeWaypoints =
    (
      await prisma.waypoint.findMany({
        where: {
          systemSymbol: homeSystem.symbol,
          exploreStatus: "UNEXPLORED",
        },
      })
    ).length > 0;

  if (hasUnexploredHomeWaypoints) {
    stage = 1;
  } else {
    stage = 2;
  }

  setInterval(() => {
    taskPopulator.populateObjectives()
    const commandShip = orchestrator.getShip(`${environmentVariables.agentName}-1`)
    if (commandShip) {
      const shipObjectives = orchestrator.getSortedObjectives(commandShip).slice(0, 10)
      console.log(shipObjectives.slice(0, 10).map(o => o.objective + ` P${o.priority} (` + o.distanceToStart(commandShip) + ' LY)'))
    }
  }, 5000);

  startShipBehavior(orchestrator, api)
  setInterval(() => {
    console.log("Checking for new ships")
    startShipBehavior(orchestrator, api)
  }, 60000)


  while (true) {
    //console.log(`Running global logic at stage ${stage}`);
    if (stage === 1) {
      taskPopulator.addPossibleObjective(ObjectiveType.EXPLORE)
    } else if (stage === 2) {
      taskPopulator.addPossibleObjective(ObjectiveType.MINE)
      taskPopulator.addPossibleObjective(ObjectiveType.TRADE)
      taskPopulator.addPossibleObjective(ObjectiveType.UPDATE_MARKET)
      taskPopulator.addPossibleObjective(ObjectiveType.PURCHASE_SHIP)
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

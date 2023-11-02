import {prisma} from "@common/prisma";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {ObjectivePopulator} from "@auto/strategy/objective-populator";
import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {APIInstance} from "@common/lib/createApi";
import {startShipBehavior} from "@auto/strategy/ship-behavior";

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
        },
        include: {
          tradeGoods: true,
        },
      })
    ).filter((w) => w.tradeGoods.length === 0).length > 0;

  if (hasUnexploredHomeWaypoints) {
    stage = 1;
  } else {
    stage = 2;
  }

  setInterval(() => {
    taskPopulator.populateObjectives()
    console.log("Current objectives", orchestrator.getObjectiveCount())
  }, 5000);

  startShipBehavior(orchestrator, api)


  while (true) {
    //console.log(`Running global logic at stage ${stage}`);
    if (stage === 1) {
      taskPopulator.addPossibleObjective(ObjectiveType.EXPLORE)
    } else if (stage === 2) {
      taskPopulator.addPossibleObjective(ObjectiveType.MINE)
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

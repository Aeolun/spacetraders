import {prisma} from "@common/prisma";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {TaskPopulator} from "@auto/strategy/task-populator";
import {TaskType} from "@auto/task/abstract-task";
import {APIInstance} from "@auto/lib/createApi";
import {startShipBehavior} from "@auto/strategy/ship-behavior";

let stage = 0;
export async function initGlobalBehavior(orchestrator: Orchestrator, taskPopulator: TaskPopulator, api: APIInstance) {
  let agent = await getBackgroundAgent();
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
    taskPopulator.populateTasks()
  }, 5000);

  startShipBehavior(orchestrator, api)


  while (true) {
    //console.log(`Running global logic at stage ${stage}`);
    if (stage === 1) {
      taskPopulator.addPossibleTask(TaskType.EXPLORE)
    } else if (stage === 2) {
      taskPopulator.addPossibleTask(TaskType.MINE)
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

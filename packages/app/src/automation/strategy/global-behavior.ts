import {prisma} from "@common/prisma";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {ObjectivePopulator} from "@auto/strategy/objective-populator";
import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {APIInstance} from "@common/lib/createApi";
import {startShipBehavior} from "@auto/strategy/ship-behavior";
import {updateMarketStats} from "@auto/background/update-market-stats";
import {Ship} from "@auto/ship/ship";
import {backgroundQueueStats, foregroundQueueStats} from "@auto/lib/queue";
import {Task} from "@auto/ship/task/task";

let stage = 0;
export async function initGlobalBehavior(orchestrator: Orchestrator<Ship, Task>, taskPopulator: ObjectivePopulator, api: APIInstance) {
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
  let ships = await prisma.ship.findMany({
    where: {
      agent: agent.symbol,
    },
  });

  if (hasUnexploredHomeWaypoints) {
    stage = 1;
  } else if (ships.filter(s => s.frameSymbol === 'FRAME_PROBE').length <= 10) {
    stage = 2;
  } else {
    stage = 3;
  }

  await orchestrator.loadObjectives()
  taskPopulator.addAllowedSystem(homeSystem.symbol)

  setInterval(() => {
    taskPopulator.populateObjectives()
    // const commandShip = orchestrator.getExecutor(`${environmentVariables.agentName}-1`)
    // if (commandShip) {
      //const shipObjectives = orchestrator.getSortedObjectives(commandShip).slice(0, 10)
      //console.log('in progress', orchestrator.getExecutingObjectiveCount(), 'current objective', shipObjectives.slice(0, 10).map(o => o.objective + ` P${o.priority} (` + o.distanceToStart(commandShip) + ` LY, ${o.requiredShipSymbols?.join(', ')})`))
    // }
    console.log({
      foregroundQueueStats: {
        totalRequests: foregroundQueueStats.totalRequests,
        requestsPerSecond: foregroundQueueStats.requestsPerSecond(),
      },
      backgroundQueueStats: {
        totalRequests: backgroundQueueStats.totalRequests,
        requestsPerSecond: backgroundQueueStats.requestsPerSecond(),
      }
    })
  }, 5000);

  startShipBehavior(orchestrator, api)
  setInterval(() => {
    console.log("Checking for new ships")
    startShipBehavior(orchestrator, api).catch(error => {
      console.log("Error starting ship behavior", error)
    })

    // consolidating market data
    updateMarketStats().catch(error => {
      console.log("Error updating market stats", error)
    })
  }, 60000)
  
  while (true) {
    console.log(`Running global logic at stage ${stage}`);
    if (stage === 1) {
      taskPopulator.addPossibleObjective(ObjectiveType.EXPLORE)
    } else if (stage === 2) {
      taskPopulator.addPossibleObjective(ObjectiveType.UPDATE_MARKET)
      taskPopulator.addPossibleObjective(ObjectiveType.PURCHASE_SHIP)
      taskPopulator.addPossibleObjective(ObjectiveType.TRADE);
    } else if (stage === 3) {
      taskPopulator.addPossibleObjective(ObjectiveType.PICKUP_CARGO)
      taskPopulator.addPossibleObjective(ObjectiveType.UPDATE_MARKET)
      taskPopulator.addPossibleObjective(ObjectiveType.PURCHASE_SHIP)
      taskPopulator.addPossibleObjective(ObjectiveType.TRADE);
      taskPopulator.addPossibleObjective(ObjectiveType.MINE)
      taskPopulator.addPossibleObjective(ObjectiveType.SIPHON)
      taskPopulator.addPossibleObjective(ObjectiveType.SURVEY)
    }

    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
}

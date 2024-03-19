import {prisma, Agent, System} from "@common/prisma";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {ObjectivePopulator} from "@auto/strategy/objective-populator";
import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {APIInstance, requestCounts} from "@common/lib/createApi";
import {startShipBehavior} from "@auto/strategy/ship-behavior";
import {updateMarketStats} from "@auto/background/update-market-stats";
import {Ship} from "@auto/ship/ship";
import {backgroundQueueStats, foregroundQueueStats} from "@auto/lib/queue";
import {Task} from "@auto/ship/task/task";
import {Objective} from "@auto/strategy/objective/objective";
import {StrategySettings} from "@auto/strategy/stategy-settings";
import {defaultSystemWayfinder} from "@common/default-wayfinder";

let stage = 0;

async function checkStage(agent: Agent, homeSystem: System) {
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
  } else if (ships.filter(s => s.frameSymbol === 'FRAME_LIGHT_FREIGHTER').length < 16) {
    stage = 3;
  } else if (agent.credits > 20_000_000) {
    stage = 5;
  } else {
    stage = 4;
  }

  return stage;
}

export async function initGlobalBehavior(orchestrator: Orchestrator<Ship, Task, Objective>, taskPopulator: ObjectivePopulator, api: APIInstance) {
  let agent = await getBackgroundAgent();

  // set this to prevent ships from immediately drifting on bootup (drift automatically happens for all travel when
  // CURRENT_CREDITS is less than 5000)
  const availableMoneyForGoals = Math.max(agent.credits, 0);
  StrategySettings.CURRENT_CREDITS = availableMoneyForGoals

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
  const homeSystem = homeWaypoint.system;

  stage = await checkStage(agent, homeSystem);
  
  taskPopulator.addAllowedSystem(homeSystem.symbol)

  console.log("Loading route planner starting from home system")
  const start = Date.now()
  await defaultSystemWayfinder.loadSystemFromDb(homeSystem.symbol)
  console.log("Loaded route planner in", Date.now() - start, "ms")
  console.log("Populating first objectives")
  await taskPopulator.populateObjectives()
  console.log("Starting ship behavior")
  await startShipBehavior(orchestrator, api)



  const orchestrateObjectives = async () => {
    console.log("Trying to assign open objectives to free executors")
    await orchestrator.tick();
    setTimeout(orchestrateObjectives, Math.max(5000/StrategySettings.SPEED_FACTOR, 200));
  }
  orchestrateObjectives();

  setInterval(async () => {
    const agent = await getBackgroundAgent();
    const availableMoneyForGoals = Math.max(agent.credits, 0);
    StrategySettings.CURRENT_CREDITS = availableMoneyForGoals

    orchestrator.setAvailableCredits(availableMoneyForGoals)

    console.log("Populating objectives");
    await taskPopulator.populateObjectives()
  }, Math.max(5000/StrategySettings.SPEED_FACTOR, 200));

  setInterval(() => {
    console.log("Checking for new ships")
    startShipBehavior(orchestrator, api).catch(error => {
      console.log("Error starting ship behavior", error)
    })

    // consolidating market data
    updateMarketStats().catch(error => {
      console.log("Error updating market stats", error)
    })

    console.log({
      foregroundQueueStats: {
        totalRequests: foregroundQueueStats.totalRequests,
        requestsPerSecond: foregroundQueueStats.requestsPerSecond(),
        averageTimeToExecute: foregroundQueueStats.averageTimeToExecute(),
        averageTotalTime: foregroundQueueStats.averageTotalTime(),
      },
      backgroundQueueStats: {
        totalRequests: backgroundQueueStats.totalRequests,
        requestsPerSecond: backgroundQueueStats.requestsPerSecond(),
        averageTimeToExecute: backgroundQueueStats.averageTimeToExecute(),
        averageTotalTime: backgroundQueueStats.averageTotalTime(),
      },
      requestCounts: requestCounts
    })
  }, 60000)
  
  while (true) {
    stage = await checkStage(agent, homeSystem);
    console.log(`Running global logic at stage ${stage}`);
    if (stage === 1) {
      taskPopulator.addPossibleObjective(ObjectiveType.EXPLORE)
    } else if (stage === 2) {
      taskPopulator.removePossibleObjective(ObjectiveType.EXPLORE)
      taskPopulator.addPossibleObjective(ObjectiveType.UPDATE_MARKET)
      taskPopulator.addPossibleObjective(ObjectiveType.PURCHASE_SHIP)
      taskPopulator.addPossibleObjective(ObjectiveType.TRADE);
    } else if (stage === 3) {
      taskPopulator.removePossibleObjective(ObjectiveType.EXPLORE)
      taskPopulator.addPossibleObjective(ObjectiveType.PICKUP_CARGO)
      taskPopulator.addPossibleObjective(ObjectiveType.UPDATE_MARKET)
      taskPopulator.addPossibleObjective(ObjectiveType.PURCHASE_SHIP)
      taskPopulator.addPossibleObjective(ObjectiveType.TRADE);
      taskPopulator.addPossibleObjective(ObjectiveType.MINE)
      taskPopulator.addPossibleObjective(ObjectiveType.SIPHON)
      taskPopulator.addPossibleObjective(ObjectiveType.SURVEY)
    } else if (stage === 4) {
      taskPopulator.removePossibleObjective(ObjectiveType.EXPLORE)
      taskPopulator.addPossibleObjective(ObjectiveType.CONSTRUCT)
      taskPopulator.addPossibleObjective(ObjectiveType.PICKUP_CARGO)
      taskPopulator.addPossibleObjective(ObjectiveType.UPDATE_MARKET)
      taskPopulator.addPossibleObjective(ObjectiveType.PURCHASE_SHIP)
      taskPopulator.addPossibleObjective(ObjectiveType.TRADE);
      taskPopulator.addPossibleObjective(ObjectiveType.MINE)
      taskPopulator.addPossibleObjective(ObjectiveType.SIPHON)
      taskPopulator.addPossibleObjective(ObjectiveType.SURVEY)
      StrategySettings.MAX_HAULERS_PER_SPOT = 3
      StrategySettings.MAX_HAULERS = 26
      StrategySettings.MULTISYSTEM = true
    } else if (stage === 5) {
      taskPopulator.removePossibleObjective(ObjectiveType.EXPLORE)
      taskPopulator.addPossibleObjective(ObjectiveType.CONSTRUCT)
      taskPopulator.addPossibleObjective(ObjectiveType.PICKUP_CARGO)
      taskPopulator.addPossibleObjective(ObjectiveType.UPDATE_MARKET)
      taskPopulator.addPossibleObjective(ObjectiveType.PURCHASE_SHIP)
      taskPopulator.addPossibleObjective(ObjectiveType.TRADE);
      taskPopulator.addPossibleObjective(ObjectiveType.MINE)
      taskPopulator.addPossibleObjective(ObjectiveType.SIPHON)
      taskPopulator.addPossibleObjective(ObjectiveType.SURVEY)
      StrategySettings.MAX_HAULERS_PER_SPOT = 3
      StrategySettings.MAX_HAULERS = 50

      StrategySettings.MULTISYSTEM = true
    }

    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
}

import { config } from "dotenv";
import Fastify from 'fastify'
console.log("Server", process.env.SERVER);
config({
  path: process.env.SERVER ? `.env.${process.env.SERVER}` : undefined,
  override: true
});

import axios from "axios";
import { resetDatabase } from "@auto/setup/reset-database";
import { getBackgroundAgentToken } from "@auto/setup/background-agent-token";
import { reloadWorldStatus } from "@auto/setup/reload-world-status";

import { prisma } from "@common/prisma";
import { initGlobalBehavior } from "@auto/strategy/global-behavior";
import { retrieveInitialUserInfo } from "./setup/retrieveInitialUserInfo";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {ObjectivePopulator} from "@auto/strategy/objective-populator";
import createApi from "@common/lib/createApi";

import {loadWaypoint} from "@auto/load-waypoints";
import {environmentVariables} from "@common/environment-variables";
import {Ship} from "@auto/ship/ship";
import {Task} from "@auto/ship/task/task";
import {Objective} from "@auto/strategy/objective/objective";
import {getDistance} from "@common/lib/getDistance";
import {TravelTimeCache} from "@auto/strategy/travel-time-cache";
import {isLocationWithWaypoint, LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {validateEngineSpeed} from "@common/lib/validate-engine-speed";
import * as http from "http";

interface StatusResponse {
  status: string;
  version: string;
  resetDate: string;
  serverResets: {
    next: string;
  };
}

let currentInstance: string;
let apiEndpoint: string;

if (!process.env.API_ENDPOINT) {
  throw new Error("API_ENDPOINT not set");
} else {
  apiEndpoint = process.env.API_ENDPOINT;
  console.log("Using API endpoint", apiEndpoint);
}

if (!process.env.ACCOUNT_EMAIL) {
  throw new Error("ACCOUNT_EMAIL not set");
}

async function loadObjectives() {
  const ships = await prisma.ship.findMany({
    where: {
      agent: environmentVariables.agentName
    }
  })

  const executingObjectives = ships.map(s => s.objective).filter(g => !!g) as string[]
  executingObjectives.push(...ships.map(s => s.nextObjective).filter(g => !!g) as string[])
  const executorsAssignedToObjective: Record<string, Set<string>> = {}
  // set executors assigned to objectives
  for (const ship of ships) {
    if (ship.objective) {
      if (!executorsAssignedToObjective[ship.objective]) {
        executorsAssignedToObjective[ship.objective] = new Set([])
      }
      executorsAssignedToObjective[ship.objective].add(ship.symbol)
    }
    if (ship.nextObjective) {
      if (!executorsAssignedToObjective[ship.nextObjective]) {
        executorsAssignedToObjective[ship.nextObjective] = new Set([])
      }
      executorsAssignedToObjective[ship.nextObjective].add(ship.symbol)
    }
  }

  return {
    executingObjectives,
    executorsAssignedToObjective
  }
}

const init = async () => {
  // do we have a database connection?
  let serverData = await prisma.server.findFirst({
    where: {
      apiUrl: apiEndpoint,
    },
  });

  if (!serverData) {
    serverData = await prisma.server.create({
      data: {
        apiUrl: apiEndpoint,
        resetDate: "",
      },
    });
  }

  let account = await prisma.account.findFirst({
    where: {
      email: process.env.ACCOUNT_EMAIL,
    },
  });

  if (!account) {
    throw new Error("You need to register the account specified in .env for the agent first.")
  }

  if (serverData && serverData.resetDate !== undefined) {
    currentInstance = serverData.resetDate;
  } else {
    throw new Error(
      "Endpoint not defined in database, please add servers you want to be able to connect to to the database."
    );
  }

  const serverStatus = await axios.get<StatusResponse>(
    apiEndpoint
  );
  const waypoints = await prisma.waypoint.count();
  const systems = await prisma.system.count();
  if (serverStatus.data.resetDate !== currentInstance) {
    console.log(
      `Server reset date ${serverStatus.data.resetDate} does not match database ${currentInstance}, updating database state.`
    );
    serverData = await prisma.server.update({
      where: {
        apiUrl: apiEndpoint,
      },
      data: {
        resetDate: serverStatus.data.resetDate,
      },
    });
    await getBackgroundAgentToken(serverData);
    await resetDatabase(serverData);
    await reloadWorldStatus(serverData);
    await retrieveInitialUserInfo(serverData);

    console.log("Database and background agent initialized. Proceeding.");
  } else if (waypoints === 0 || systems === 0) {
    console.log("Zero waypoints and/or systems in database, reloading world.");

    await reloadWorldStatus(serverData);
    await retrieveInitialUserInfo(serverData);
  }

  const token = await getBackgroundAgentToken(serverData);
  const api = createApi(token)

  const {executingObjectives, executorsAssignedToObjective} = await loadObjectives()

  const orchestrator = new Orchestrator<Ship, Task, Objective>(executingObjectives, executorsAssignedToObjective, {
    autostartControlLoop: true,
    getDistance: (ship, objective) => {
      if (objective.startingLocation === 'self') {
        return 0
      }
      if (ship.currentSystemSymbol === objective.startingLocation.system.symbol) {
        return objective.startingLocation.waypoint ? getDistance(ship.currentWaypoint, objective.startingLocation.waypoint) : 0
      }
      // assume we have to fly all the way across the system if we move systems, just so intra-system objectives are prioritized
      return 800+getDistance(ship.currentSystem, objective.startingLocation.system)
    },
    getTravelTime: (ship, from, to) => {
      if (validateEngineSpeed(ship.engineSpeed) && isLocationWithWaypoint(from) && isLocationWithWaypoint(to)) {
        return TravelTimeCache.calculate(ship.engineSpeed, ship.maxFuel, from, to)
      }
      return 100000;
    },
    objectiveValid: (ship, objective) => {
      const isAtOwnLocation = objective.startingLocation === 'self' || objective.startingLocation.waypoint?.symbol === ship.currentWaypointSymbol
      if (ship.fuel === 0 && !isAtOwnLocation) {
        return false;
      }
      return true
    }
  });
  const taskPopulator = new ObjectivePopulator(orchestrator);

  loadWaypoint(serverData).catch((error) => {
    console.error("Issue during waypoint loading", error);
  })

  const ipcPort = process.env.PORT ? parseInt(process.env.PORT)+4 : 4005
  const fastify = Fastify({
    logger: true
  })
  fastify.post('/cancel-objective', async (request, reply) => {
    const {shipSymbol, objective} = request.body as {shipSymbol: string, objective: string}
    const ship = orchestrator.getExecutor(shipSymbol)
    if (!ship) {
      reply.status(404).send({error: "Ship not found"})
      return;
    }
    try {
      await orchestrator.cancelObjectiveAssignment(shipSymbol, objective);
    } catch(error) {
      reply.status(500).send({error: error?.toString()})
      return;
    }

    return {success: true}
  });
  fastify.listen({
    port: ipcPort,
  }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`IPC server listening on ${address}`)
  });

  await initGlobalBehavior(orchestrator, taskPopulator, api);
};

init().catch((error) => {
  console.error("Issue during initialization, server probably broken", error);
  process.exit(1);
});

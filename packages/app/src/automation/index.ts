import { config } from "dotenv";

import axios from "axios";
import { resetDatabase } from "@auto/setup/reset-database";
import { getBackgroundAgentToken } from "@auto/setup/background-agent-token";
import { reloadWorldStatus } from "@auto/setup/reload-world-status";

import { prisma } from "@common/prisma";
import { initGlobalBehavior } from "@auto/strategy/global-behavior";
import { retrieveInitialUserInfo } from "./setup/retrieveInitialUserInfo";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {TaskPopulator} from "@auto/strategy/task-populator";
import createApi from "@common/lib/createApi";

config();

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
  console.log("Using API endpoint", );
}

if (!process.env.ACCOUNT_EMAIL) {
  throw new Error("ACCOUNT_EMAIL not set");
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
  const orchestrator = new Orchestrator();
  const taskPopulator = new TaskPopulator(orchestrator);

  await initGlobalBehavior(orchestrator, taskPopulator, api);
};

init().catch((error) => {
  console.error("Issue during initialization, server probably broken", error);
  process.exit(1);
});

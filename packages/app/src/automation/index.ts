import { config } from "dotenv";

import axios from "axios";
import { resetDatabase } from "@auto/setup/reset-database";
import { getBackgroundAgentToken } from "@auto/setup/background-agent-token";
import { reloadWorldStatus } from "@auto/setup/reload-world-status";

import { prisma } from "@auto/prisma";
import { initGlobalBehavior } from "@auto/strategy/global-behavior";
import { retrieveInitialUserInfo } from "./setup/retrieveInitialUserInfo";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {TaskPopulator} from "@auto/strategy/task-populator";
import createApi from "@auto/lib/createApi";

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

if (!process.env.API_ENDPOINT) {
  throw new Error("API_ENDPOINT not set");
} else {
  console.log("Using API endpoint", process.env.API_ENDPOINT);
}

if (!process.env.ACCOUNT_EMAIL) {
  throw new Error("ACCOUNT_EMAIL not set");
}

const init = async () => {
  // do we have a database connection?
  let serverData = await prisma.server.findFirst({
    where: {
      apiUrl: process.env.API_ENDPOINT,
    },
  });

  if (!serverData) {
    serverData = await prisma.server.create({
      data: {
        apiUrl: process.env.API_ENDPOINT,
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
    process.env.API_ENDPOINT
  );
  if (serverStatus.data.resetDate !== currentInstance) {
    console.log(
      `Server reset date ${serverStatus.data.resetDate} does not match database ${currentInstance}, updating database state.`
    );
    serverData = await prisma.server.update({
      where: {
        apiUrl: process.env.API_ENDPOINT,
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

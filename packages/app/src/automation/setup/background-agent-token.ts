import fs from "fs";
import createApi from "@common/lib/createApi";
import jwtDecode from "jwt-decode";
import { prisma, Server } from "@common/prisma";
import { RegisterRequest } from "spacetraders-sdk";
import {storeAgentToken} from "@common/lib/data-update/store-agent-token";
import {environmentVariables} from "@common/environment-variables";

export const getBackgroundAgentToken = async (server?: Server) => {
  let agentToken, agentTokenData: { reset_date: string } | undefined;

  if (!server) {
    server = await prisma.server.findFirstOrThrow({
      where: {
        apiUrl: environmentVariables.apiEndpoint,
      },
      orderBy: {
        resetDate: "desc",
      }
    });
  }

  const agent = await prisma.agent.findFirst({
    where: {
      symbol: environmentVariables.agentName,
      reset: server.resetDate,
    },
  });
  if (agent && agent.token) {
    agentTokenData = jwtDecode(agent.token);
  }

  if (
    !agent ||
    !agent.token ||
    (server.resetDate && agentTokenData?.reset_date !== server.resetDate)
  ) {
    console.log(
      "No agent in database, no token for agent, or reset_date on token is not the same as server. Obtaining new token."
    );

    console.log("Registering agent on server.");
    const registerApi = createApi("");

    const result = await registerApi.default
      .register({
        symbol: environmentVariables.agentName,
        email: environmentVariables.agentEmail,
        faction: environmentVariables.agentFaction as RegisterRequest["faction"],
      })
      .catch((error) => {
        console.log("Error registering agent", error.response.data);
        process.exit(1);
      });

    await storeAgentToken(
      environmentVariables.accountEmail,
      result.data.data.agent,
      result.data.data.token
    );
    console.log("Updated token in database");

    agentToken = result.data.data.token;
  } else {
    agentToken = agent.token;
  }

  return agentToken;
};

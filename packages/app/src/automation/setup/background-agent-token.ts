import fs from "fs";
import createApi from "@auto/lib/createApi";
import jwtDecode from "jwt-decode";
import {
  processAgent,
  processShip,
  registerToken,
  updateShips,
} from "@auto/ship/updateShips";
import { prisma, Server } from "@auto/prisma";
import { RegisterRequest } from "spacetraders-sdk";
import { ensureTextStyle } from "pixi.js";

export const getBackgroundAgentToken = async (server: Server) => {
  let agentToken, agentTokenData;

  const agent = await prisma.agent.findFirst({
    where: {
      symbol: process.env.AGENT_NAME,
      reset: server.resetDate,
    },
  });
  if (agent && agent.token) {
    agentTokenData = jwtDecode(agent.token);
  }

  console.log("Agent token reset date", {
    token: agentTokenData?.reset_date,
    server: server.resetDate,
  });
  if (
    !agent ||
    !agent.token ||
    (server.resetDate && agentTokenData.reset_date !== server.resetDate)
  ) {
    console.log(
      "No agent in database, no token for agent, or reset_date on token is not the same as server. Obtaining new token."
    );

    console.log("Registering agent on server.");
    const registerApi = createApi("");

    const result = await registerApi.default
      .register({
        symbol: process.env.AGENT_NAME,
        email: process.env.AGENT_EMAIL,
        faction: process.env.AGENT_FACTION as RegisterRequest["faction"],
      })
      .catch((error) => {
        console.log("Error registering agent", error.response.data);
        process.exit(1);
      });

    await registerToken(
      process.env.ACCOUNT_EMAIL,
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

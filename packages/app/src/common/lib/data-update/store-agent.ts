import {Agent} from "spacetraders-sdk";
import {prisma} from "@common/prisma";
import {environmentVariables} from "@common/environment-variables";

export async function processAgent(agent: Agent) {
  const serverState = await prisma.server.findFirstOrThrow({
    where: {
      apiUrl: environmentVariables.apiEndpoint,
    },
  });

  await prisma.agent.update({
    where: {
      symbol_reset: {
        symbol: agent.symbol,
        reset: serverState.resetDate,
      },
    },
    data: {
      credits: agent.credits,
      headquartersSymbol: agent.headquarters,
    },
  });
}
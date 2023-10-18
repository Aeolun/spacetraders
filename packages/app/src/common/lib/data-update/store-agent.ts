import {Agent} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function processAgent(agent: Agent) {
  const serverState = await prisma.server.findFirstOrThrow({
    where: {
      apiUrl: process.env.API_ENDPOINT,
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
      accountId: agent.accountId,
    },
  });
}
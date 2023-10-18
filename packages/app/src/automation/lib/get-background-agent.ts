import {prisma} from "@common/prisma";

export const getBackgroundAgent = async () => {
  const server = await prisma.server.findFirstOrThrow({
    where: {
      apiUrl: process.env.API_ENDPOINT
    }
  })
  return prisma.agent.findFirstOrThrow({
    where: {
      reset: server.resetDate,
      symbol: process.env.AGENT_NAME,
    },
  });
}
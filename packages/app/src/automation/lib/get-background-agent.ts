import {prisma} from "@auto/prisma";

export const getBackgroundAgent = async () => {
  const server = await prisma.server.findFirstOrThrow({
    where: {
      endpoint: process.env.API_ENDPOINT
    }
  })
  return prisma.agent.findFirstOrThrow({
    where: {
      reset: server.resetDate,
      symbol: process.env.AGENT_NAME,
      server: process.env.API_ENDPOINT
    },
    include: {
      headquarters: {
        include: {
          system: true
        }
      }
    }
  });
}
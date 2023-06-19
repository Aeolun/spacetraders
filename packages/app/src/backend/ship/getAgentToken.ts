import {prisma} from "@app/prisma";

export const getAgentToken = async (agent: string) => {
  const a = await prisma.agent.findFirstOrThrow({
    where: {
      symbol: agent
    }
  })

  return a.token
}
import createApi from "@auto/lib/createApi";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {prisma} from "@auto/prisma";
import {Agent} from "spacetraders-sdk";
import {backgroundQueue} from "@auto/lib/queue";

export async function updateLeaderboard() {
  const currentTime = new Date()
  currentTime.setSeconds(0)
  currentTime.setMilliseconds(0)
  currentTime.setMinutes(Math.floor(currentTime.getMinutes() / 30)*30)

  const server = await prisma.server.findFirst({})

  const token = await getBackgroundAgentToken()
  const api = createApi(token)

  console.log("get leaderboard page 1")
  let res = await backgroundQueue(() => api.agents.getAgents(1, 20))
  const total = res.data.meta.total

  await insertIntoLeaderboard(currentTime, server.resetDate, res.data.data)
  for(let i = 2; i < Math.ceil(total / 20); i++) {
    console.log("get leaderboard page", i)
    res = await backgroundQueue(() => api.agents.getAgents(i, 20))
    await insertIntoLeaderboard(currentTime, server.resetDate, res.data.data)
  }
}

export function scheduleLeaderboardUpdate() {
  const currentTime = new Date()
  currentTime.setSeconds(0)
  currentTime.setMilliseconds(0)
  currentTime.setMinutes(Math.floor(currentTime.getMinutes() / 30)*30)

  console.log("last leaderboard update", currentTime.toISOString())

  const nextUpdate = new Date(currentTime.getTime() + (30*60*1000)+1500)
  console.log('next leaderboard update', nextUpdate.toISOString());


  console.log("Next leaderboard update in", (nextUpdate.getTime() - Date.now()) / 1000, "seconds")

  setTimeout(async () => {
    await updateLeaderboard()
    scheduleLeaderboardUpdate()
  }, nextUpdate.getTime() - Date.now())
}

async function insertIntoLeaderboard(currentTime: Date, resetDate: string, data: Agent[]) {
  return prisma.leaderboard.createMany({
    data: data.map((agent, index) => {
      return {
        agentSymbol: agent.symbol,
        reset: resetDate,
        dateTime: currentTime,
        credits: agent.credits,
        ships: agent.shipCount,
      }
    }),
    skipDuplicates: true
  })
}
import {resetDatabase} from "@auto/setup/reset-database";
import {reloadWorldStatus} from "@auto/setup/reload-world-status";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {prisma, Server} from "@auto/prisma";
import {initAgent} from "@auto/agent/init-agent";
import {loadWaypoint} from "@auto/init";
import {backgroundQueue} from "@auto/lib/queue";
import axios from "axios";
import {GetStatus200Response} from "spacetraders-sdk";

export const initWorld = async (server: Server, newResetDate: string) => {
  console.log("Resetting database")
  await resetDatabase(server)
  console.log("Reloading world from API")
  await reloadWorldStatus(server)
  console.log("Getting (new) token")
  const newToken = await getBackgroundAgentToken(server);
  console.log("Have token!", newToken)


  console.log("Reset completed")
  await prisma.server.update({
    where: {
      endpoint: process.env.API_ENDPOINT
    },
    data: {
      resetDate
    }
  })

  await initAgent(newToken);
  loadWaypoint().then(() => {
    console.log('Waypoint load complete')
  })

  return newToken
}

const resetTimeout = () => {
  resetYetInterval = setInterval(async () => {
    const serverStatus = await backgroundQueue(() => axios.get<StatusResponse>(process.env.API_ENDPOINT))

    if (serverStatus.data.resetDate !== currentInstance) {
      // yay! reset completed
      console.log("Reset completed! Restarting client.")
      // need to exit with non zero code so concurrently will restart
      process.exit(1);
    }
  }, 5000)
}

export const startResetBehaviorForServer = async (server: Server) => {
  const serverStatus = await axios.get<GetStatus200Response>(process.env.API_ENDPOINT)

  let agentToken;
  console.log('Current data reset date: ', server.resetDate)
  console.log('API reset date', serverStatus.data.resetDate)
  const timeUntilReset = new Date(serverStatus.data.serverResets.next).getTime() - Date.now()
  if (server.resetDate === serverStatus.data.resetDate) {
    console.log(`Waiting ${timeUntilReset - 3600 * 1000} milliseconds, until 1 hour before reset time to begin polling`)
    agentToken = await getBackgroundAgentToken(server)
    await initAgent(agentToken);

    loadWaypoint().then(() => {
      console.log('Waypoint load complete')
    })
    // start checking for reset one hour before indicated
  } else {
    console.log("Server already reset or never initialized.")

    agentToken = await initWorld(server, serverStatus.data.resetDate)
  }

  setTimeout(resetTimeout, Math.max(timeUntilReset - 3600 * 1000, 0))
}

import fs from "fs";
import createApi from "@auto/lib/createApi";
import jwtDecode from "jwt-decode";
import {processAgent, processShip, registerToken} from "@auto/ship/updateShips";
import {prisma} from "@auto/prisma";
import {RegisterRequest} from "spacetraders-sdk";

export const getBackgroundAgentToken = async (resetDate?: string) => {
    let agentToken, agentTokenData

    const agent = await prisma.agent.findFirst({
        where: {
            symbol: process.env.AGENT_NAME,
            reset: resetDate,
            server: process.env.API_ENDPOINT,
        }
    })
    if (agent && agent.token) {
        agentTokenData = jwtDecode(agent.token);
    }

    console.log("Agent token reset date", agentTokenData?.reset_date, resetDate)
    if (!agent || !agent.token || (resetDate && agentTokenData.reset_date !== resetDate)) {
        console.log("No agent in database, no token for agent, or reset_date on token is not the same as server. Obtaining new token.")

        console.log("Registering agent on server.")
        const registerApi = createApi('')

        const result = await registerApi.default.register({
            symbol: process.env.AGENT_NAME,
            email: process.env.AGENT_EMAIL,
            faction: process.env.AGENT_FACTION as RegisterRequest['faction'],
        })

        await registerToken(process.env.ACCOUNT_EMAIL, result.data.data.agent, result.data.data.token)
        console.log("Updated token in database")


        agentToken = result.data.data.token
    } else {
        agentToken = agent.token
    }

    return agentToken
}

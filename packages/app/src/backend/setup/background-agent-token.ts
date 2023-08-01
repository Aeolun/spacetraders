import fs from "fs";
import createApi from "@app/lib/createApi";
import jwtDecode from "jwt-decode";
import {processAgent, processShip} from "@app/ship/updateShips";
import {prisma} from "@app/prisma";
import {RegisterRequest} from "spacetraders-sdk";

export const getBackgroundAgentToken = async (resetDate?: string) => {
    let agentToken, agentTokenData

    const agent = await prisma.agent.findFirst({
        where: {
            symbol: process.env.AGENT_NAME
        }
    })
    if (agent && agent.token) {
        agentTokenData = jwtDecode(agent.token);
    }

    console.log("Agent token reset date", agentTokenData?.reset_date, resetDate)
    if (!agent || !agent.token || (resetDate && agentTokenData.reset_date !== resetDate)) {
        console.log("No agent in database, no token for agent, or reset_date on token is not the same as server. Obtaining new token.")
        let existingToken;
        try {
            existingToken = fs.readFileSync('.agent-token', 'utf-8')
            console.log("Loading token from .agent-token file.")
        } catch(error) {
            // no token
        }

        if (!existingToken) {
            console.log("Registering agent on server.")
            const registerApi = createApi('')

            const result = await registerApi.default.register({
                symbol: process.env.AGENT_NAME,
                email: process.env.AGENT_EMAIL,
                faction: process.env.AGENT_FACTION as RegisterRequest['faction'],
            })
            await processAgent(result.data.data.agent, result.data.data.token, true)
            console.log("Updated token in database")
            existingToken = result.data.data.token
        }

        agentToken = existingToken
    } else {
        agentToken = agent.token
    }

    return agentToken
}

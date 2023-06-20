import fs from "fs";
import createApi from "@app/lib/createApi";
import jwtDecode from "jwt-decode";
import {RegisterRequestFactionEnum} from "spacetraders-sdk";
import {processAgent, processShip} from "@app/ship/updateShips";
import {prisma} from "@app/prisma";

export const getBackgroundAgentToken = async (resetDate?: string) => {
    let agentToken, agentTokenData

    const agent = await prisma.agent.findFirst({
        where: {
            symbol: process.env.AGENT_NAME
        }
    })
    if (agent) {
        agentTokenData = jwtDecode(agent.token);
    }

    if (!agent || !agent.token || (resetDate && agentTokenData.reset_date !== resetDate)) {
        let existingToken;
        try {
            existingToken = fs.readFileSync('.agent-token', 'utf-8')
        } catch(error) {
            // no token
        }

        if (existingToken) {
            console.log("Loading token from .agent-token file.")
            const api = createApi(existingToken)
            const existingData = await api.agents.getMyAgent()

            await processAgent(existingData.data.data, existingToken)

            agentToken = existingToken
        } else {
            console.log("No agent token or agent token for older reset.")
            const api = createApi('')

            const result = await api.default.register({
                symbol: process.env.AGENT_NAME,
                email: process.env.AGENT_EMAIL,
                faction: process.env.AGENT_FACTION as RegisterRequestFactionEnum
            })
            await processAgent(result.data.data.agent, result.data.data.token)
            await processShip(result.data.data.ship)

            agentToken = result.data.data.token
        }
    } else {
        agentToken = agent.token
    }

    return agentToken
}
import fs from "fs";
import api from "@app/lib/createApi";
import createApi from "@app/lib/createApi";
import jwtDecode from "jwt-decode";
import {RegisterRequestFactionEnum} from "spacetraders-sdk";
import {processShip} from "@app/ship/updateShips";

export const getBackgroundAgentToken = async (resetDate?: string) => {
    let agentToken, agentTokenData

    if (fs.existsSync('.agent-token')) {
        agentToken = fs.readFileSync('.agent-token').toString()
        agentTokenData = jwtDecode(agentToken);
    }

    if (!agentToken || (resetDate && agentTokenData.reset_date !== resetDate)) {
        console.log("No agent token or agent token for older reset.")
        const api = createApi('')

        const result = await api.default.register({
            symbol: process.env.AGENT_NAME,
            email: process.env.AGENT_EMAIL,
            faction: process.env.AGENT_FACTION as RegisterRequestFactionEnum
        })
        fs.writeFileSync(`dumps/registrationResult${resetDate}.json`, JSON.stringify(result.data, null, 2))
        fs.writeFileSync('.agent-token', result.data.data.token)
        await processShip(result.data.data.ship)
        agentToken = result.data.data.token
    } else {
        agentToken = fs.readFileSync('.agent-token').toString().trim()
    }

    return agentToken
}

export const deleteBackgroundAgentToken = () => {
    fs.unlinkSync('.agent-token')
}
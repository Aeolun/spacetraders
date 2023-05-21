import api from "@app/lib/createApi";
import {processAgent, updateShips} from "@app/ship/updateShips";
import {prisma} from "@app/prisma";
import {defaultShipStore} from "@app/ship/shipStore";
import fs from "fs";
import {backgroundQueue} from "@app/lib/queue";
import {storeWaypointScan} from "@app/ship/storeResults";
import createApi from "@app/lib/createApi";

export const initAgent = async (token: string) => {
    const api = createApi(token)

    const res = await api.agents.getMyAgent()
    await processAgent(res.data.data)
    const agentSymbol = res.data.data.symbol

    try {
        await updateShips(api)
        console.log("All ships updated for "+agentSymbol)
    } catch (error) {
        console.log(error?.response?.data ? JSON.stringify(error.response.data, null, 2) : error.toString())
        throw error
    }
}
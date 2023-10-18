import {updateShips} from "@auto/ship/updateShips";
import createApi from "@auto/lib/createApi";
import jwtDecode from "jwt-decode";
import {processAgent} from "@common/lib/data-update/store-agent";

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
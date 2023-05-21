import fs from "fs";
import api from "@app/lib/createApi";
import createApi from "@app/lib/createApi";

export const getBackgroundAgentToken = async () => {
    let agentToken
    if (!fs.existsSync('.agent-token') || fs.readFileSync('.agent-token').toString().trim() == '') {
        const api = createApi('')

        const result = await api.default.register({
            symbol: "PHANTASM",
            email: "bart@serial-experiments.com",
            faction: "GALACTIC"
        })
        fs.writeFileSync('dumps/registrationResult.json', JSON.stringify(result.data, null, 2))
        fs.writeFileSync('.agent-token', result.data.data.token)
        agentToken = result.data.data.token
    } else {
        agentToken = fs.readFileSync('.agent-token').toString().trim()
    }

    return agentToken
}

export const deleteBackgroundAgentToken = () => {
    fs.unlinkSync('.agent-token')
}
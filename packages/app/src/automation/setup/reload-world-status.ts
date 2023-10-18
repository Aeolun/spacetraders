import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {seedFactions, seedSystems} from "@auto/seed/seedGameData";
import {prisma, Server} from "@common/prisma";
import {generateName} from "@auto/lib/generate-name";

export const reloadWorldStatus = async (server: Server) => {
    try {
        const agentToken = await getBackgroundAgentToken(server)

        await seedSystems(agentToken)
        await seedFactions(agentToken)

        const allSystems = await prisma.system.findMany({})

        const newNames: Record<string, string> = {}
        for(const s of allSystems) {
            newNames[s.symbol] = generateName()
        }

        const systemkeys = Object.keys(newNames)
        // 30 transations in parallel
        for(let i = 0; i < allSystems.length; i += 30) {
            await Promise.all(systemkeys.slice(i, i + 30).map(symbol => {
                return prisma.system.update({
                    data: {
                        name: newNames[symbol]
                    },
                    where: {
                        symbol: symbol
                    }
                })
            }))
        }

        console.log("Generated readable names for all systems")
    } catch (error) {
        console.error(error.response?.data ? error.response.data : error)
    }
}
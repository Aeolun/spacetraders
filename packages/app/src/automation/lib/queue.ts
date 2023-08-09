import ThrottledQueue from 'throttled-queue'

export type Queue = ReturnType<typeof ThrottledQueue>

export const agentQueue: Record<string, Queue> = {}

export const createOrGetAgentQueue = (agentId: string) => {
    if (agentQueue[agentId]) {
        return agentQueue[agentId]
    } else {
        agentQueue[agentId] = ThrottledQueue(process.env.FOREGROUND_RATELIMIT ? parseInt(process.env.FOREGROUND_RATELIMIT) : 2, 1000)
    }
    return agentQueue[agentId]
}

export const backgroundQueue = ThrottledQueue(process.env.BACKGROUND_RATELIMIT ? parseInt(process.env.BACKGROUND_RATELIMIT) : 1, 1000);
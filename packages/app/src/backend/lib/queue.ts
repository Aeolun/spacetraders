import ThrottledQueue from 'throttled-queue'

export type Queue = ReturnType<typeof ThrottledQueue>

export const agentQueue: Record<string, Queue> = {}

export const createOrGetAgentQueue = (agentId: string) => {
    if (agentQueue[agentId]) {
        return agentQueue[agentId]
    } else {
        agentQueue[agentId] = ThrottledQueue(1, 600)
    }
    return agentQueue[agentId]
}

export const backgroundQueue = ThrottledQueue(1, 1000);
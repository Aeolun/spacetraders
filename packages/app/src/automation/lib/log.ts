import {prisma, LogLevel} from "@common/prisma";

export async function logShipAction(ship: string, action: string, level: LogLevel = LogLevel.INFO) {
    console.log(`${new Date().toISOString()} [${ship}] ${action}`)
    await prisma.shipLog.create({
        data: {
            symbol: ship,
            message: action,
            level: level
        }
    })
}
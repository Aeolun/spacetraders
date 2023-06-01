import {prisma} from "@app/prisma";

export async function logShipAction(ship: string, action: string) {
    console.log(`${new Date().toISOString()} [${ship}] ${action}`)
    await prisma.shipLog.create({
        data: {
            symbol: ship,
            message: action
        }
    })
}
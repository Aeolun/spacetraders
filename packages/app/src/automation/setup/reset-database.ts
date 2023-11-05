import {prisma, Server} from "@common/prisma";

export const resetDatabase = async (server: Server) => {
    await prisma.$transaction(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE "System", "Sector", "Waypoint", "Construction", "MarketPrice", "ShipCargo", "Ship", "TradeLog", "ShipLog", "TravelLog", "JumpDistance" CASCADE`
    })
    console.log("Truncated tables")
}
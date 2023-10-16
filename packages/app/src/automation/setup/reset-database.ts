import {prisma, Server} from "@auto/prisma";

export const resetDatabase = async (server: Server) => {
    await prisma.$transaction(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE "System", "Sector", "Waypoint", "MarketPrice", "ShipCargo", "Jumpgate", "Ship", "TradeLog", "ShipLog", "TravelLog", "JumpConnectedSystem", "JumpDistance" CASCADE`
    })
    console.log("Truncated tables")
}
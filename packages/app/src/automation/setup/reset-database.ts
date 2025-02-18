import {prisma, Server} from "@common/prisma";

export const resetDatabase = async (server: Server) => {
    await prisma.$transaction(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE "System", "Sector", "ShipyardModel", "Waypoint", "Construction", "MarketPrice", "MarketPriceHistory", "ShipCargo", "Ship", "Ledger", "ShipLog", "ShipTask", "TravelLog", "JumpDistance" CASCADE`
    })
    console.log("Truncated tables")
}
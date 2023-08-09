import {prisma} from "@auto/prisma";

export const resetDatabase = async () => {
    await prisma.$transaction(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE \`System\``
        await prisma.$executeRaw`TRUNCATE TABLE Sector`
        await prisma.$executeRaw`TRUNCATE TABLE Waypoint`
        await prisma.$executeRaw`TRUNCATE TABLE MarketPrice`
        await prisma.$executeRaw`TRUNCATE TABLE ShipCargo`
        await prisma.$executeRaw`TRUNCATE TABLE Jumpgate`
        await prisma.$executeRaw`TRUNCATE TABLE Ship`
        await prisma.$executeRaw`TRUNCATE TABLE TradeLog`
        await prisma.$executeRaw`TRUNCATE TABLE ShipLog`
        await prisma.$executeRaw`TRUNCATE TABLE TravelLog`
        await prisma.$executeRaw`TRUNCATE TABLE JumpConnectedSystem`
        await prisma.$executeRaw`TRUNCATE TABLE JumpDistance`
    })
}
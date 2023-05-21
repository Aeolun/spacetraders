import {prisma} from "@app/prisma";

export const resetDatabase = async () => {
    await prisma.$transaction(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE Faction`
        await prisma.$executeRaw`TRUNCATE TABLE System`
        await prisma.$executeRaw`TRUNCATE TABLE Agent`
        await prisma.$executeRaw`TRUNCATE TABLE Server`
        await prisma.$executeRaw`TRUNCATE TABLE Sector`
        await prisma.$executeRaw`TRUNCATE TABLE Waypoint`
        await prisma.$executeRaw`TRUNCATE TABLE MarketPrice`
        await prisma.$executeRaw`TRUNCATE TABLE ShipCargo`
        await prisma.$executeRaw`TRUNCATE TABLE Ship`
    })
}
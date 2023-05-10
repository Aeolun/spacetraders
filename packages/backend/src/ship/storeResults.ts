import {prisma} from "@app/prisma";
import {CreateShipWaypointScan201ResponseData} from "spacetraders-sdk";

export async function storeWaypointScan(data: CreateShipWaypointScan201ResponseData) {
    await Promise.all(data.waypoints.map(async waypoint => {
        const updateValues = {
            factionSymbol: waypoint.faction.symbol,
            chartSubmittedBy: waypoint.chart.submittedBy,
            chartSubmittedOn: waypoint.chart.submittedOn,
            traits: {
                connectOrCreate: waypoint.traits.map(trait => {
                    return {
                        where: {
                            symbol: trait.symbol,
                        },
                        create: {
                            symbol: trait.symbol,
                            name: trait.name,
                            description: trait.description
                        }
                    }
                })
            },
            orbitals: {
                connect: waypoint.orbitals.map(orb => {
                    return {
                        symbol: orb.symbol
                    }
                })
            }
        }
        await prisma.waypoint.upsert({
            where: {
                symbol: waypoint.symbol
            },
            create: {
                ...updateValues,
                symbol: waypoint.symbol,
                type: waypoint.type,
                systemSymbol: waypoint.systemSymbol,
                x: waypoint.x,
                y: waypoint.y,
            },
            update: updateValues
        })
    }))
}
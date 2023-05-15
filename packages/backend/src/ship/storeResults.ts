import {prisma} from "@app/prisma";
import {
    CreateShipShipScan201Response,
    CreateShipShipScan201ResponseData,
    ScannedWaypoint,
    Waypoint,
    CreateShipWaypointScan201ResponseData, GetSystemWaypoints200Response
} from "spacetraders-sdk";
import {processShip} from "@app/ship/updateShips";

export async function storeWaypointScan(systemSymbol: string, data: CreateShipWaypointScan201ResponseData | GetSystemWaypoints200Response) {
    const waypoints: (Waypoint | ScannedWaypoint)[] = 'waypoints' in data ? data.waypoints : data.data
    await Promise.all(waypoints.map(async waypoint => {
        return storeWaypoint(waypoint)
    }))

    await prisma.system.update({
        where: {
            symbol: systemSymbol
        },
        data: {
            waypointsRetrieved: true
        }
    })

}

export async function storeWaypoint(waypoint: Waypoint | ScannedWaypoint) {
    if (waypoint.faction) {
        try {
            await prisma.faction.upsert({
                where: {
                    symbol: waypoint.faction.symbol
                },
                create: {
                    symbol: waypoint.faction.symbol
                },
                update: {
                    symbol: waypoint.faction.symbol
                },
            })
        } catch(error) {
            console.log("Error creating", waypoint.faction)
        }
    }
    try {
        const updateValues = {
            factionSymbol: waypoint.faction?.symbol,
            chartSubmittedBy: waypoint.chart?.submittedBy,
            chartSubmittedOn: waypoint.chart?.submittedOn,
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
    } catch(error) {
        console.error("Issue updating waypoint", error.toString())
    }
}


export async function storeShipScan(data: CreateShipShipScan201ResponseData) {
    await Promise.all(data.ships.map(async ship => {
        return processShip(ship)
    }))
}
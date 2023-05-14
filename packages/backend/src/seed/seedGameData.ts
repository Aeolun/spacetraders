import axios from "axios";
import {prisma} from "../prisma";

export const seedGameData = async (agentToken: string) => {
    const data = await axios.get('https://api.spacetraders.io/v2/systems.json', {
        headers: {
            Authorization: 'Bearer '+ agentToken
        }
    })

    const sectors = await prisma.sector.findMany({})
    const existingSectorIds = {}
    sectors.forEach(s => existingSectorIds[s.symbol] = true)

    const systems = await prisma.system.findMany({})
    const existingSystems = {}
    systems.forEach(s => existingSystems[s.symbol] = true)

    for(const system of data.data) {
        if (!existingSectorIds[system.sectorSymbol]) {
            await prisma.sector.create({
                data: {
                    symbol: system.sectorSymbol,
                }
            })
            existingSectorIds[system.sectorSymbol] = true
        }

        if (!existingSystems[system.symbol]) {
            await prisma.system.upsert({
                where: {
                    symbol: system.symbol,
                },
                update: {},
                create: {
                    symbol: system.symbol,
                    sectorSymbol: system.sectorSymbol,
                    type: system.type,
                    x: system.x,
                    y: system.y,
                }
            })

            await prisma.waypoint.createMany({
                data: system.waypoints.map(waypoint => {
                    return {
                        symbol: waypoint.symbol,
                        type: waypoint.type,
                        systemSymbol: system.symbol,
                        x: waypoint.x,
                        y: waypoint.y
                    }
                })
            })
        }
    }

    const factionData = await axios.get('https://api.spacetraders.io/v2/factions', {
        headers: {
            Authorization: 'Bearer '+agentToken
        }
    })

    const factions = await prisma.faction.findMany({})
    const existingFactions = {}
    factions.forEach(f => existingFactions[f.symbol] = true)

    for(const faction of factionData.data.data) {
        console.log(faction);
        if (!existingFactions[faction.symbol]) {
            await prisma.faction.create({
                data: {
                    symbol: faction.symbol,
                    name: faction.name,
                    description: faction.description,
                    headquartersSymbol: faction.headquarters,
                    traits: {
                        connectOrCreate: faction.traits.map(t => {
                            return {
                                where: {
                                    symbol: t.symbol,
                                },
                                create: {
                                    symbol: t.symbol,
                                    name: t.name,
                                    description: t.description
                                }
                            }
                        })
                    }
                }
            })
        }
    }
}
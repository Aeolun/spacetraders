import axios from "axios";
import {prisma} from "../prisma";
import createApi from "@app/lib/createApi";

export const seedSystems = async (agentToken: string) => {
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

    const createableSystems = []
    const creatableWaypoints = {}
    for(const system of data.data) {
        if (!existingSectorIds[system.sectorSymbol]) {
            await prisma.sector.create({
                data: {
                    symbol: system.sectorSymbol,
                }
            })
            existingSectorIds[system.sectorSymbol] = true
        }

        let hasJumpGate = false
        system.waypoints.forEach(waypoint => {
            if (waypoint.type === 'JUMP_GATE') {
                hasJumpGate = true
            }
            creatableWaypoints[waypoint.symbol] = {
                symbol: waypoint.symbol,
                type: waypoint.type,
                systemSymbol: system.symbol,
                x: waypoint.x,
                y: waypoint.y
            }
        })

        if (!existingSystems[system.symbol]) {
            createableSystems.push({
                symbol: system.symbol,
                sectorSymbol: system.sectorSymbol,
                type: system.type,
                x: system.x,
                y: system.y,
                hasJumpGate: hasJumpGate
            })
        }
    }

    console.log("creating systems")
    await prisma.system.createMany({
        data: createableSystems
    })

    const waypointList = Object.values(creatableWaypoints) as any
    for(let i = 0; i < waypointList.length; i += 1000) {
        console.log('creating waypoints', i, 'to '+(i+1000))
        await prisma.waypoint.createMany({
            data: waypointList.slice(i, i+1000)
        })
    }
}

export const seedFactions = async (agentToken) => {
    const factionData = await axios.get('https://api.spacetraders.io/v2/factions?page=1&limit=20', {
        headers: {
            Authorization: 'Bearer '+agentToken
        }
    })

    const factions = await prisma.faction.findMany({})
    const existingFactions = {}
    factions.forEach(f => existingFactions[f.symbol] = true)

    for(const faction of factionData.data.data) {
        console.log(`updating faction ${faction.symbol}`)
        await prisma.faction.upsert({
            where: {
                symbol: faction.symbol
            },
            update: {
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
            },
            create: {
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
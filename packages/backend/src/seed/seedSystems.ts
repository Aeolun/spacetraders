import axios from "axios";
import {prisma} from "../prisma";

export const seedSystems = async () => {
    const data = await axios.get('https://api.spacetraders.io/v2/systems.json', {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiUEhBTlRBU00iLCJpYXQiOjE2ODM2NDI1MzgsInN1YiI6ImFnZW50LXRva2VuIn0.ImyX3u0uCuilva9knsfyC3_FXfSwzlPWki3PK9r2_OEg3Czsiw2jcebtjqTCTv2wboixm-uwc84I4KFCxAVF7rftwDutOD7jhnMzE1FJUkAzVPrpZhVr6gKUT9U6RMYKnNi-AHBI2dCwmOsOwUMaCI9etin-OqCjZ2bcu0NCwJyLW87T81TKkFhhRevXQp-gBDfYjC4BN8WARmXg85u-01W7Bvd5d69ySnG6eV5bcgj4mmu3mr2CFFD96rUIKq5Kd9EZ66ukYuSSUj7wtyEds3Gru1lpRcXMxoNYZfTQH7qdxfhA5zJK6FKHFhRfkxGVydLXJ4D4pVcmn30AJicSA2uq_J6YBhFTsbn9ylh8tOSyxNKEAnn1vqOQiCc2C455ARhSTdR5aC0TWrjJQZk2-NYwYw1ZNXHjnWYAp8_6zUaHyRUbX0p9Q7VXMNSreTYPZqHlfLB5aTNIwlitLPwXNU3icwt1DjtyW9uUSTicsd0PgdhETrliLYwAMdea3TQy'
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
            Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiUEhBTlRBU00iLCJpYXQiOjE2ODM2NDI1MzgsInN1YiI6ImFnZW50LXRva2VuIn0.ImyX3u0uCuilva9knsfyC3_FXfSwzlPWki3PK9r2_OEg3Czsiw2jcebtjqTCTv2wboixm-uwc84I4KFCxAVF7rftwDutOD7jhnMzE1FJUkAzVPrpZhVr6gKUT9U6RMYKnNi-AHBI2dCwmOsOwUMaCI9etin-OqCjZ2bcu0NCwJyLW87T81TKkFhhRevXQp-gBDfYjC4BN8WARmXg85u-01W7Bvd5d69ySnG6eV5bcgj4mmu3mr2CFFD96rUIKq5Kd9EZ66ukYuSSUj7wtyEds3Gru1lpRcXMxoNYZfTQH7qdxfhA5zJK6FKHFhRfkxGVydLXJ4D4pVcmn30AJicSA2uq_J6YBhFTsbn9ylh8tOSyxNKEAnn1vqOQiCc2C455ARhSTdR5aC0TWrjJQZk2-NYwYw1ZNXHjnWYAp8_6zUaHyRUbX0p9Q7VXMNSreTYPZqHlfLB5aTNIwlitLPwXNU3icwt1DjtyW9uUSTicsd0PgdhETrliLYwAMdea3TQy'
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
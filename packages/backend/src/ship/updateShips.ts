import api from '@app/lib/apis'
import {prisma} from "@app/prisma";
import {Agent, Cooldown, ScannedShip, Ship, ShipCargo, ShipFuel, ShipNav} from "spacetraders-sdk";
import fs from "fs";

export async function updateShips() {
    const ships = await api.fleet.getMyShips(1, 20)
    fs.writeFileSync('ships.json', JSON.stringify(ships.data.data, null, 2))
    await Promise.all(ships.data.data.map(async ship => {
        return processShip(ship)
    }))
}

export async function processShip(ship: Ship | ScannedShip) {
    if ('modules' in ship) {
        for (const module of ship.modules) {
            const smsplit = module.symbol.split('_')
            const moduleData = {
                symbol: module.symbol,
                name: module.name,
                description: module.description,

                effectName: smsplit.slice(1, smsplit.length - 1).join('_'),
                value: module.range ?? module.capacity,

                crewRequirement: module.requirements.crew,
                powerRequirement: module.requirements.power,
                slotRequirement: module.requirements.slots,
            }
            await prisma.shipModule.upsert({
                where: {
                    symbol: module.symbol
                },
                create: moduleData,
                update: moduleData
            })
        }
    }
    if (ship.mounts) {
        for (const module of ship.mounts) {
            const smsplit = module.symbol.split('_')
            const mountData = 'name' in module ? {
                symbol: module.symbol,
                name: module.name,
                description: module.description,

                effectName: smsplit.slice(1, smsplit.length - 1).join('_'),
                value: module.strength,
                worksOn: module.deposits?.join(','),

                crewRequirement: module.requirements.crew,
                powerRequirement: module.requirements.power,
                slotRequirement: module.requirements.slots,
            } : {
                symbol: module.symbol
            }
            await prisma.shipMount.upsert({
                where: {
                    symbol: module.symbol
                },
                create: mountData,
                update: mountData
            })
        }
    }

    const frameData = 'name' in ship.frame ? {
        symbol: ship.frame.symbol,
        name: ship.frame.name,
        description: ship.frame.description,

        moduleSlots: ship.frame.moduleSlots,
        mountingPoints: ship.frame.mountingPoints,
        fuelCapacity: ship.frame.fuelCapacity,

        crewRequirement: ship.frame.requirements.crew,
        powerRequirement: ship.frame.requirements.power,
    } : {
        symbol: ship.frame.symbol
    }

    const reactorData = 'name' in ship.reactor ? {
        symbol: ship.reactor.symbol,
        name: ship.reactor.name,
        description: ship.reactor.description,

        powerOutput: ship.reactor.powerOutput,

        crewRequirement: ship.reactor.requirements.crew,
    } : {
        symbol: ship.reactor.symbol
    }

    const engineData = 'name' in ship.engine ? {
        symbol: ship.engine.symbol,
        name: ship.engine.name,
        description: ship.engine.description,

        speed: ship.engine.speed,

        crewRequirement: ship.engine.requirements.crew,
        powerRequirement: ship.engine.requirements.power,
    } : {
        symbol: ship.engine.symbol
    }

        const shipData = {
            symbol: ship.symbol,
            name: ship.registration.name,
            factionSymbol: ship.registration.factionSymbol,
            role: ship.registration.role,

            currentSystem: {
                connect: {
                    symbol: ship.nav.systemSymbol
                }
            },
            currentWaypoint: {
                connect: {
                    symbol: ship.nav.waypointSymbol
                }
            },

            destinationWaypoint: {
                connect: {
                    symbol: ship.nav.route.destination.symbol
                }
            },
            departureWaypoint: {
                connect: {
                    symbol: ship.nav.route.departure.symbol
                }
            },
            departureOn: ship.nav.route.departureTime,
            arrivalOn: ship.nav.route.arrival,

            navStatus: ship.nav.status,
            flightMode: ship.nav.flightMode,

            fuelCapacity: ship.fuel?.capacity,
            fuelAvailable: ship.fuel?.current,

            cargoCapacity: ship.cargo?.capacity,
            cargoUsed: ship.cargo?.units,

            frame: {
                connectOrCreate: {
                    where: {
                        symbol: ship.frame.symbol,
                    },
                    create: frameData
                }
            },
            reactor: {
                connectOrCreate: {
                    where: {
                        symbol: ship.reactor.symbol
                    },
                    create: reactorData
                }
            },
            engine: {
                connectOrCreate: {
                    where: {
                        symbol: ship.engine.symbol
                    },
                    create: engineData
                }
            },
            modules: {
                connect: 'modules' in ship ? ship.modules.map(m => ({ symbol: m.symbol })) : []
            },
            mounts: {
                connect: ship.mounts.map(m => ({ symbol: m.symbol }))
            }
        }
        await prisma.ship.upsert({
            where: {
                symbol: ship.symbol,
            },
            create: shipData,
            update: shipData
        })
    if ('cargo' in ship) {
        await processCargo(ship.symbol, ship.cargo)
    }
}

export async function processNav(shipSymbol: string, nav: ShipNav) {
    const shipData = {
        currentSystemSymbol: nav.systemSymbol,
        currentWaypointSymbol: nav.waypointSymbol,

        destinationWaypointSymbol: nav.route.destination.symbol,
        departureWaypointSymbol: nav.route.departure.symbol,
        departureOn: nav.route.departureTime,
        arrivalOn: nav.route.arrival,

        navStatus: nav.status,
        flightMode: nav.flightMode,
    }
    return await prisma.ship.update({
        where: {
            symbol: shipSymbol,
        },
        include: {
            currentWaypoint: true,
            destinationWaypoint: true,
            departureWaypoint: true,
            frame: true,
            reactor: true,
            engine: true,
            mounts: true,
            modules: true
        },
        data: shipData
    })
}

export async function processFuel(shipSymbol: string, fuel: ShipFuel) {
    return await prisma.ship.update({
        where: {
            symbol: shipSymbol
        },
        include: {
            currentWaypoint: true,
            destinationWaypoint: true,
            departureWaypoint: true,
            frame: true,
            reactor: true,
            engine: true,
            mounts: true,
            modules: true
        },
        data: {
            fuelCapacity: fuel.capacity,
            fuelAvailable: fuel.current
        }
    })
}

export async function processAgent(agent: Agent) {
    return await prisma.agent.upsert({
        where: {
            symbol: agent.symbol
        },
        create: {
            symbol: agent.symbol,
            credits: agent.credits,
            accountId: agent.accountId,
            headquartersSymbol: agent.headquarters
        },
        update: {
            credits: agent.credits,
            headquartersSymbol: agent.headquarters
        }
    })
}

export async function processCooldown(shipSymbol: string, cooldown: Cooldown) {
    return await prisma.ship.update({
        where: {
            symbol: shipSymbol
        },
        include: {
            currentWaypoint: true,
            destinationWaypoint: true,
            departureWaypoint: true,
            frame: true,
            reactor: true,
            engine: true,
            mounts: true,
            modules: true
        },
        data: {
            reactorCooldownOn: cooldown.expiration,
        }
    })
}

export async function processCargo(shipSymbol: string, cargo: ShipCargo) {
    await Promise.all(cargo.inventory.map(async c => {
        await prisma.tradeGood.upsert({
            where: {
                symbol: c.symbol,
            },
            create: {
                name: c.name,
                symbol: c.symbol,
                description: c.description
            },
            update: {
                name: c.name,
                symbol: c.symbol,
                description: c.description
            }
        })
        return prisma.shipCargo.upsert({
            where: {
                shipSymbol_tradeGoodSymbol: {
                    shipSymbol: shipSymbol,
                    tradeGoodSymbol: c.symbol,
                },
            },
            update: {
                units: c.units,
            },
            create: {
                shipSymbol: shipSymbol,
                tradeGoodSymbol: c.symbol,
                units: c.units
            }
        })
    }))

    return returnShipData(shipSymbol)
}

export async function returnShipData(shipSymbol: string) {
    return prisma.ship.findFirst({
        where: {
            symbol: shipSymbol
        },
        include: {
            currentWaypoint: true,
            destinationWaypoint: true,
            departureWaypoint: true,
            frame: true,
            reactor: true,
            engine: true,
            mounts: true,
            modules: true
        }
    })
}
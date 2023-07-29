import {APIInstance} from '@app/lib/createApi'
import {prisma} from "@app/prisma";
import {
    Agent,
    Cooldown,
    ScannedShip, ScannedShipEngine, ScannedShipFrame, ScannedShipMountsInner, ScannedShipReactor,
    Ship,
    ShipCargo, ShipEngine, ShipFrame,
    ShipFuel,
    ShipModule,
    ShipMount,
    ShipNav, ShipReactor
} from "spacetraders-sdk";

export async function updateShips(api: APIInstance) {
    const ships = await api.fleet.getMyShips(1, 20)
    await Promise.all(ships.data.data.map(async ship => {
        return processShip(ship)
    }))
}

export async function processModule(module: ShipModule) {
    const smsplit = module.symbol.split('_')
    const moduleData = {
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
        create: {
            symbol: module.symbol,
            ...moduleData
        },
        update: moduleData
    })
}

export async function processMount(module: ShipMount | ScannedShipMountsInner) {
    const smsplit = module.symbol.split('_')
    const mountData = 'name' in module ? {
        name: module.name,
        description: module.description,

        effectName: smsplit.slice(1, smsplit.length - 1).join('_'),
        value: module.strength,
        worksOn: module.deposits?.join(','),

        crewRequirement: module.requirements.crew,
        powerRequirement: module.requirements.power,
        slotRequirement: module.requirements.slots,
    } : {
        name: module.symbol,
        description: module.symbol
    }
    await prisma.shipMount.upsert({
        where: {
            symbol: module.symbol
        },
        create: {
            symbol: module.symbol,
            ...mountData
        },
        update: mountData
    })
}

export async function processShipFrame(frame: ShipFrame | ScannedShipFrame) {
    const frameData = 'name' in frame ? {
        name: frame.name,
        description: frame.description,

        moduleSlots: frame.moduleSlots,
        mountingPoints: frame.mountingPoints,
        fuelCapacity: frame.fuelCapacity,

        crewRequirement: frame.requirements.crew,
        powerRequirement: frame.requirements.power,
    } : {
        name: frame.symbol,
        description: frame.symbol,
    }

    return prisma.shipFrame.upsert({
        where: {
            symbol: frame.symbol
        },
        create: {
            symbol: frame.symbol,
            ...frameData
        },
        update: frameData
    })
}

export async function processShipEngine(engine: ShipEngine | ScannedShipEngine) {
    const engineData = 'name' in engine ? {
        name: engine.name,
        description: engine.description,

        speed: engine.speed,

        crewRequirement: engine.requirements.crew,
        powerRequirement: engine.requirements.power,
    } : {
        name: engine.symbol,
        description: engine.symbol,
    }

    return prisma.shipEngine.upsert({
        where: {
            symbol: engine.symbol
        },
        create: {
            symbol: engine.symbol,
            ...engineData
        },
        update: engineData
    })
}

export async function processReactor(reactor: ShipReactor | ScannedShipReactor) {
    const reactorData = 'name' in reactor ? {
        name: reactor.name,
        description: reactor.description,

        powerOutput: reactor.powerOutput,

        crewRequirement: reactor.requirements.crew,
    } : {
        name: reactor.symbol,
        description: reactor.symbol,
    }

    return prisma.shipReactor.upsert({
        where: {
            symbol: reactor.symbol
        },
        create: {
            symbol: reactor.symbol,
            ...reactorData
        },
        update: reactorData
    })
}

export async function processShip(ship: Ship | ScannedShip) {
    if ('modules' in ship) {
        for (const module of ship.modules) {
            await processModule(module)
        }
    }
    if (ship.mounts) {
        for (const module of ship.mounts) {
            await processMount(module)
        }
    }

    await processShipFrame(ship.frame)
    await processShipEngine(ship.engine)
    await processReactor(ship.reactor)

    const shipData = {
        symbol: ship.symbol,
        name: ship.registration.name,
        agent: ship.registration.name.split('-').slice(0, 1).join(),
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
            connect: {
                symbol: ship.frame.symbol,
            }
        },
        reactor: {
            connect: {
                symbol: ship.reactor.symbol
            }
        },
        engine: {
            connect: {
                symbol: ship.engine.symbol
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
            modules: true,
            cargo: true,
        },
        data: {
            fuelCapacity: fuel.capacity,
            fuelAvailable: fuel.current
        }
    })
}

export async function processAgent(agent: Agent, token?: string) {

    await prisma.agent.upsert({
        where: {
            symbol: agent.symbol
        },
        create: {
            symbol: agent.symbol,
            credits: agent.credits,
            accountId: agent.accountId,
            headquartersSymbol: agent.headquarters,
            token: token,
        },
        update: {
            credits: agent.credits,
            headquartersSymbol: agent.headquarters,
            accountId: agent.accountId,
        }
    })
    const existingAgent = await prisma.agent.findUnique({
        where: {
            symbol: agent.symbol
        }
    });
    if (!existingAgent.token) {
        return await prisma.agent.updateMany({
            where: {
                symbol: agent.symbol,
            },
            data: {
                token: token
            }
        })
    }
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
    await prisma.$transaction(async () => {
        await prisma.ship.update({
            where: {
                symbol: shipSymbol,
            },
            data: {
                cargoUsed: cargo.units,
                cargoCapacity: cargo.capacity,
            }
        })
        // remove existing cargo
        await prisma.shipCargo.deleteMany({
            where: {
                shipSymbol: shipSymbol
            }
        })
        // create a new entry for every cargo item
        for (const c of cargo.inventory) {
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
                    description: c.description
                }
            })
            await prisma.shipCargo.upsert({
                where: {
                    shipSymbol_tradeGoodSymbol: {
                        shipSymbol: shipSymbol,
                        tradeGoodSymbol: c.symbol
                    }
                },
                create: {
                    shipSymbol: shipSymbol,
                    tradeGoodSymbol: c.symbol,
                    units: c.units
                },
                update: {
                    units: c.units
                }
            })
        }
    })

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
            modules: true,
            cargo: true
        }
    })
}
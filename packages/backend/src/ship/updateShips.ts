import api from '@app/lib/apis'
import {prisma} from "@app/prisma";
import {Cooldown, ShipCargo, ShipFuel, ShipNav} from "spacetraders-sdk";

export async function updateShips() {
    const ships = await api.fleet.getMyShips(1, 20)

    await Promise.all(ships.data.data.map(async ship => {
        const shipData = {
            symbol: ship.symbol,
            name: ship.registration.name,
            factionSymbol: ship.registration.factionSymbol,
            role: ship.registration.role,

            currentSystemSymbol: ship.nav.systemSymbol,
            currentWaypointSymbol: ship.nav.waypointSymbol,

            destinationWaypointSymbol: ship.nav.route.destination.symbol,
            departureWaypointSymbol: ship.nav.route.departure.symbol,
            departureOn: ship.nav.route.departureTime,
            arrivalOn: ship.nav.route.arrival,

            navStatus: ship.nav.status,
            flightMode: ship.nav.flightMode,

            fuelCapacity: ship.fuel.capacity,
            fuelAvailable: ship.fuel.current,

            cargoCapacity: ship.cargo.capacity,
            cargoUsed: ship.cargo.units,
        }
        await prisma.ship.upsert({
            where: {
                symbol: ship.symbol,
            },
            create: shipData,
            update: shipData
        })
        await processCargo(ship.symbol, ship.cargo)
    }))
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
        },
        data: {
            fuelCapacity: fuel.capacity,
            fuelAvailable: fuel.current
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
        }
    })
}
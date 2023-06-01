import {scale, systemCoordinates, systemScale} from "@front/lib/consts";
import {GameState, ShipData} from "@front/lib/game-state";
import {universeView} from "@front/lib/UIElements";

let waypointShips: Record<string, number> = {}

export function resetShipWaypoints() {
    waypointShips = {}
}

export function positionShip(ship: ShipData) {
    let serverX, serverY, navRot, xOffset = 0, yOffset = 0
    const arrivalOn = new Date(ship.arrivalOn)
    const departureOn = new Date(ship.departureOn)

    if (ship.destinationWaypoint.symbol !== ship.departureWaypoint.symbol && Date.now() < arrivalOn.getTime()) {
        const positionAlongPath = (Date.now() - departureOn.getTime())/(arrivalOn.getTime() - departureOn.getTime())

        serverX = ship.departureWaypoint.x + (ship.destinationWaypoint.x - ship.departureWaypoint.x) * positionAlongPath
        serverY = ship.departureWaypoint.y + (ship.destinationWaypoint.y - ship.departureWaypoint.y) * positionAlongPath
        navRot = Math.atan2(ship.destinationWaypoint.y - ship.departureWaypoint.y, ship.destinationWaypoint.x - ship.departureWaypoint.x) + Math.PI/2;
    } else {
        const orbitSymbol = ship.currentWaypoint.orbitsSymbol ? ship.currentWaypoint.orbitsSymbol : ship.currentWaypoint.symbol
        if (waypointShips[orbitSymbol] === undefined) {
            waypointShips[orbitSymbol] = 0
        } else {
            waypointShips[orbitSymbol]++
        }

        serverX = ship.currentWaypoint.x
        serverY = ship.currentWaypoint.y

        xOffset = (32 * waypointShips[orbitSymbol])
        yOffset = 80
    }
    const x = serverX * systemScale + xOffset + Math.abs(systemCoordinates.minX) * systemScale
    const y = serverY * systemScale + yOffset + Math.abs(systemCoordinates.minY) * systemScale

    return {
        x, y, navRot
    }
}

export function positionUniverseShip(ship: ShipData) {
    let serverX, serverY, navRot, xOffset = 0, yOffset = 0
    const arrivalOn = new Date(ship.arrivalOn)
    const departureOn = new Date(ship.departureOn)

    const sizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth


    if (ship.destinationWaypoint.systemSymbol !== ship.departureWaypoint.systemSymbol && Date.now() < arrivalOn.getTime()) {
        const positionAlongPath = (Date.now() - departureOn.getTime())/(arrivalOn.getTime() - departureOn.getTime())

        const departureSystem = GameState.systems[ship.departureWaypoint.systemSymbol]
        const destinationSystem = GameState.systems[ship.destinationWaypoint.systemSymbol]

        serverX = departureSystem.x + (destinationSystem.x - departureSystem.x) * positionAlongPath
        serverY = departureSystem.y + (destinationSystem.y - departureSystem.y) * positionAlongPath
        navRot = Math.atan2(destinationSystem.y - departureSystem.y, destinationSystem.x - departureSystem.x) + Math.PI/2;
    } else {
        if (waypointShips[ship.currentWaypoint.systemSymbol] === undefined) {
            waypointShips[ship.currentWaypoint.systemSymbol] = 0
        } else {
            waypointShips[ship.currentWaypoint.systemSymbol]++
        }

        const currentSystem = GameState.systems[ship.currentWaypoint.systemSymbol]

        serverX = currentSystem.x
        serverY = currentSystem.y

        xOffset = (32 * waypointShips[ship.currentWaypoint.systemSymbol]) * sizeMultiplier
        yOffset = 80 * sizeMultiplier
    }
    const x = serverX + xOffset
    const y = serverY + yOffset

    return {
        x, y, navRot
    }
}
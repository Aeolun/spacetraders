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
        if (waypointShips[ship.currentWaypoint.symbol] === undefined) {
            waypointShips[ship.currentWaypoint.symbol] = 0
        } else {
            waypointShips[ship.currentWaypoint.symbol]++
        }

        serverX = ship.currentWaypoint.x
        serverY = ship.currentWaypoint.y

        xOffset = (32 * waypointShips[ship.currentWaypoint.symbol])
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

        const departureSystem = GameState.visibleSystems[ship.departureWaypoint.systemSymbol].container
        const destinationSystem = GameState.visibleSystems[ship.destinationWaypoint.systemSymbol].container

        serverX = departureSystem.x + (destinationSystem.x - departureSystem.x) * positionAlongPath
        serverY = departureSystem.y + (destinationSystem.y - departureSystem.y) * positionAlongPath
        navRot = Math.atan2(destinationSystem.y - departureSystem.y, destinationSystem.x - departureSystem.x) + Math.PI/2;
    } else {
        if (waypointShips[ship.currentWaypoint.systemSymbol] === undefined) {
            waypointShips[ship.currentWaypoint.systemSymbol] = 0
        } else {
            waypointShips[ship.currentWaypoint.systemSymbol]++
        }

        const currentSystem = GameState.visibleSystems[ship.currentWaypoint.systemSymbol].container

        serverX = currentSystem.x
        serverY = currentSystem.y

        xOffset = (32 * waypointShips[ship.currentWaypoint.systemSymbol] * sizeMultiplier)
        yOffset = 80 * sizeMultiplier
    }
    const x = serverX + xOffset * scale.universe
    const y = serverY + (yOffset)

    return {
        x, y, navRot
    }
}
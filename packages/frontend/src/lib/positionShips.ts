import {systemCoordinates, systemScale} from "@app/lib/consts";
import {PositionData} from "@app/lib/game-state";

let waypointShips: Record<string, number> = {}

export function resetShipWaypoints() {
    waypointShips = {}
}

export function positionShip(ship: PositionData) {
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
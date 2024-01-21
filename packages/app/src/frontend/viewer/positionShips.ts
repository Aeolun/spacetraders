import {scale, systemCoordinates} from "@front/viewer/consts";
import {Registry, ShipData, WaypointData} from "@front/viewer/registry";
import {universeView} from "@front/viewer/UIElements";
import {getStarPosition, getSystemPosition} from "@front/viewer/util";

let waypointShips: Record<string, number> = {}

export function resetShipWaypoints() {
    waypointShips = {}
}

const planetOrbitSpeed = 20000
// export function positionWaypoint(waypoint: WaypointData, timeElapsed: number) {
//     let x, y
//
//     if (waypoint.orbitsSymbol) {
//         const orbitData = Registry.waypointData[waypoint.orbitsSymbol]
//
//         const orbitDistance = Math.sqrt(Math.pow(waypoint.x, 2) + Math.pow(waypoint.y,2 ))
//         const orbitalPeriod = orbitDistance * planetOrbitSpeed
//
//         const currentAngle = (timeElapsed % orbitalPeriod / orbitalPeriod + orbitData.offset) * Math.PI * 2
//         x = (Math.abs(systemCoordinates.minX) + Math.cos(currentAngle) * orbitDistance) * systemScale
//         y = (Math.abs(systemCoordinates.minY) + Math.sin(currentAngle) * orbitDistance) * systemScale
//
//
//         const ownOrbitalPeriod = 60 * 500
//         const ownAngle = (timeElapsed % ownOrbitalPeriod / ownOrbitalPeriod + waypoint.offset) * Math.PI * 2
//         const offsetX = Math.cos(ownAngle) * 60
//         const offsetY = Math.sin(ownAngle) * 60
//
//         x += offsetX
//         y += offsetY
//     } else {
//         const orbitDistance = Math.sqrt(Math.pow(waypoint.x, 2) + Math.pow(waypoint.y,2 ))
//         const orbitalPeriod = orbitDistance * planetOrbitSpeed
//
//         const currentAngle = (timeElapsed % orbitalPeriod / orbitalPeriod + waypoint.offset) * Math.PI * 2
//         x = (Math.abs(systemCoordinates.minX) + Math.cos(currentAngle) * orbitDistance) * systemScale
//         y = (Math.abs(systemCoordinates.minY) + Math.sin(currentAngle) * orbitDistance) * systemScale
//     }
//
//     return {
//         x, y
//     }
// }

export function countShipWaypoints() {
    waypointShips = {}
  for(const ship of Object.values(Registry.shipData)) {
    const arrivalDate = ship.arrivalOn ? new Date(ship.arrivalOn) : undefined
    if (arrivalDate && arrivalDate <= Date.now()) {
      waypointShips[ship.currentWaypoint.symbol] = waypointShips[ship.currentWaypoint.symbol] ? waypointShips[ship.currentWaypoint.symbol] + 1 : 1;
    }
  }
}

export function positionShips() {
  const shipPositions: Record<string, {
    position: {
      x: number,
      y: number,
    }
    navRot: number
  }> = {}
  const currentWaypointCount: Record<string, number> = {}
  for(const ship of Object.values(Registry.shipData)) {
    let serverX = 0, serverY = 0, navRot, xOffset = 0, yOffset = 0
    const arrivalOn = new Date(ship.arrivalOn)
    const departureOn = new Date(ship.departureOn)

    if (ship.destinationWaypoint && ship.departureWaypoint && ship.destinationWaypoint.symbol !== ship.departureWaypoint.symbol && Date.now() < arrivalOn.getTime()) {
      const positionAlongPath = (Date.now() - departureOn.getTime()) / (arrivalOn.getTime() - departureOn.getTime())

      try {
        const from = Registry.waypoints[ship.departureWaypoint.symbol]
        const to = Registry.waypoints[ship.destinationWaypoint.symbol]

        serverX = from.x + (to.x - from.x) * positionAlongPath
        serverY = from.y + (to.y - from.y) * positionAlongPath
        navRot = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
      } catch (e) {
        serverX = 0
        serverY = 0
        navRot = 0
      }
    } else if (ship.currentWaypoint) {
      const orbitSymbol = ship.currentWaypoint.symbol
      if (currentWaypointCount[orbitSymbol] === undefined) {
        currentWaypointCount[orbitSymbol] = 0
      } else {
        currentWaypointCount[orbitSymbol]++
      }

      const currWaypoint = Registry.waypoints[ship.currentWaypoint.symbol]

      if (currWaypoint) {
        const newPos = currWaypoint.position

        serverX = newPos.x
        serverY = newPos.y

        // position in a circle around the planet
        const orbitDistance = 36 * currWaypoint.scaleFactor
        const orbitalPeriod = 50000
        const orbitMultiplier = currentWaypointCount[orbitSymbol] / waypointShips[orbitSymbol]
        const orbitOffset = (Math.PI * 2) * orbitMultiplier
        xOffset = Math.cos(Date.now() % orbitalPeriod / orbitalPeriod * Math.PI * 2 + orbitOffset) * orbitDistance
        yOffset = Math.sin(Date.now() % orbitalPeriod / orbitalPeriod * Math.PI * 2 + orbitOffset) * orbitDistance
        // turn in the direction of travel
        navRot = (((Date.now()+ (orbitalPeriod*orbitMultiplier)) % orbitalPeriod) / orbitalPeriod) * Math.PI * 2 + Math.PI;
        // xOffset = 32 * currWaypoint.scaleFactor + 8
        // yOffset = 20 * waypointShips[orbitSymbol]
      } else {
        serverX = 0
        serverY = 0
        navRot = 0
      }
    }
    const x = serverX + xOffset
    const y = serverY + yOffset

    shipPositions[ship.symbol] = {
      position: {
        x, y
      },
      navRot: navRot ?? 0
    }
  }
  return shipPositions
}

// export function positionUniverseShip(ship: ShipData) {
//     let serverX, serverY, navRot, xOffset = 0, yOffset = 0
//     const arrivalOn = new Date(ship.arrivalOn)
//     const departureOn = new Date(ship.departureOn)
//
//     const sizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth
//
//
//     if (ship.destinationWaypoint.systemSymbol !== ship.departureWaypoint.systemSymbol && Date.now() < arrivalOn.getTime()) {
//         const positionAlongPath = (Date.now() - departureOn.getTime())/(arrivalOn.getTime() - departureOn.getTime())
//
//         const departureSystem = Registry.systems[ship.departureWaypoint.systemSymbol]
//         const destinationSystem = Registry.systems[ship.destinationWaypoint.systemSymbol]
//
//         serverX = departureSystem.x + (destinationSystem.x - departureSystem.x) * positionAlongPath
//         serverY = departureSystem.y + (destinationSystem.y - departureSystem.y) * positionAlongPath
//         navRot = Math.atan2(destinationSystem.y - departureSystem.y, destinationSystem.x - departureSystem.x) + Math.PI/2;
//     } else {
//         if (waypointShips[ship.currentWaypoint.systemSymbol] === undefined) {
//             waypointShips[ship.currentWaypoint.systemSymbol] = 0
//         } else {
//             waypointShips[ship.currentWaypoint.systemSymbol]++
//         }
//
//         const currentSystem = Registry.systems[ship.currentWaypoint.systemSymbol]
//
//         serverX = currentSystem.x
//         serverY = currentSystem.y
//
//         xOffset = (32 * waypointShips[ship.currentWaypoint.systemSymbol]) * sizeMultiplier
//         yOffset = 80 * Math.min(sizeMultiplier, 8)
//     }
//     const x = serverX + xOffset
//     const y = serverY + yOffset
//
//     return {
//         x, y, navRot
//     }
// }
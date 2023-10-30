import {trpc} from "@front/trpc";
import {starsContainer, universeView} from "@front/viewer/UIElements";
import {Registry, ShipData, System, WaypointData} from "@front/viewer/registry";
import {mapScale, systemCoordinates, systemDistanceMultiplier} from "@front/viewer/consts";
import {Text, Container, Graphics, Sprite, PointData} from "pixi.js";
import {positionShip, resetShipWaypoints} from "@front/viewer/positionShips";
import {loadedAssets} from "@front/viewer/assets";
// import {makeInteractiveAndSelectable} from "@front/viewer/makeInteractiveAndSelectable";
import {Waypoint} from "@common/prisma";
import {UniverseEntity} from "@front/viewer/universe-entity";
import {getStarPosition, getSystemPosition} from "@front/viewer/util";
import {getDistance} from "@common/lib/getDistance";

function createOrbitGraphics(orbit: Graphics, diameter: number, color: number = 0x111111, width = 2) {
  orbit.circle(0, 0, diameter).stroke({
    width: width,
    color: color,
  })

  return orbit
}

function getTraitIcons(item: WaypointData) {
  const traits: string[] = []
  item.traits.forEach(trait => {
    if (trait.symbol === 'MARKETPLACE') {
      traits.push('market')
    }
    if (trait.symbol === 'SHIPYARD') {
      traits.push('shipyard')
    }
  })
  return traits;
}

function createSystemItem(data: {
    star: PointData
    waypoint: WaypointData
    parent?: PointData
    rotation?: number
  }, scale = 1, index = 0) {

  let position = getSystemPosition(data.waypoint, data.star)
  if (data.parent && data.rotation !== undefined) {
    const offsetX = Math.sin(data.rotation ?? 0) * 48
    const offsetY = Math.cos(data.rotation ?? 0) * 48
    position.x += offsetX
    position.y += offsetY
  }

  console.log('creating system item', data.waypoint.symbol, data.waypoint.type)
  const universeEntity = new UniverseEntity({
    texture: loadedAssets.spritesheet.textures[`public/textures/planets/${data.waypoint.type}.png`],
    label: data.waypoint.symbol + ' - ' + data.waypoint.type,
    traits: getTraitIcons(data.waypoint),
    position: position,
    scale: scale,
    onSelect: () => {
      Registry.deselect()
      Registry.selected = {
        type: 'waypoint',
        symbol: data.waypoint.symbol,
      }
    }
  })

  // makeInteractiveAndSelectable(orbitingGroup, {
  //   onMouseOver: () => {
  //     console.log('hovered', data.waypoint)
  //     Registry.hoveredWaypoint = data.waypoint
  //     orbitingText.visible = true
  //   },
  //   onMouseOut: () => {
  //     Registry.hoveredWaypoint = undefined
  //     orbitingText.visible = false
  //   },
  //   onSelect: {
  //     type: 'waypoint',
  //     symbol: data.waypoint.symbol,
  //   },
  //   onOrder: [
  //     {
  //       name: "navigate",
  //       withSelection: 'ship',
  //       action: async (selectedSymbol: string) => {
  //         const res = await trpc.instructNavigate.mutate({
  //           shipSymbol: selectedSymbol,
  //           waypointSymbol: data.waypoint.symbol,
  //         })
  //         Registry.shipData[res.symbol] = res
  //         console.log("updated state for ship "+res.symbol)
  //       }
  //     }
  //   ]
  // })

  return universeEntity
}

export async function loadSystem(systemSymbol: string) {
  if (Registry.transformedSystems[systemSymbol]) {
    return;
  }
  Registry.transformedSystems[systemSymbol] = true
  console.log('loading system', systemSymbol)

  const waypoints = Registry.waypointsForSystem[systemSymbol] ?? await trpc.waypointsForSystem.query({
    system: systemSymbol,
  })

  waypoints.forEach(waypoint => {
    Registry.waypointData[waypoint.symbol] = waypoint
  })

  const starData = Registry.systemData[systemSymbol]
  if (!Registry.systemObjects[systemSymbol]) {
    Registry.systemObjects[systemSymbol] = []
  }

  // let texture = loadedAssets.sheet.textures[`planets/tile/${starData.type}.png`]
  // const star = new Sprite(texture)
  // star.x = starData.x+32
  // star.y = starData.y+32
  // star.pivot = {
  //   x: 32,
  //   y: 32
  // }
  // starsContainer.addChild(star)

  resetShipWaypoints()

  const centerPoint = {x: 0, y: 0}
  const asteroidBands: {start: number, end: number}[] = []
  waypoints.sort((a, b) => {
    return getDistance(a, {x: 0, y: 0}) - getDistance(b, centerPoint)
  })

  let startBand, lastBand
  waypoints.filter(item => item.type === 'ASTEROID').forEach(item => {
    if (!startBand) {
      startBand = getDistance(item, centerPoint)
    }
    if (getDistance(item, centerPoint) - startBand > 100) {
      asteroidBands.push({
        start: startBand,
        end: lastBand
      })
      startBand = getDistance(item, centerPoint)
    }
    lastBand = getDistance(item, centerPoint)
  })
  asteroidBands.push({
    start: startBand,
    end: lastBand
  })

  console.log("bands", asteroidBands)

  const orbitGraphics = new Graphics();
  orbitGraphics.alpha = 0.5
  orbitGraphics.eventMode = 'none'
  const starPos = getStarPosition(starData);
  orbitGraphics.x = starPos.x
  orbitGraphics.y = starPos.y
  waypoints.filter(item => !item.orbitsSymbol && item.type !== 'ASTEROID' && item.type !== 'MOON' && item.type !== 'ORBITAL_STATION').forEach(item => {
    const diameter = Math.sqrt(Math.pow(item.x, 2) + Math.pow(item.y, 2)) * mapScale
    createOrbitGraphics(orbitGraphics, diameter)
  });
  asteroidBands.forEach(band => {
    createOrbitGraphics(orbitGraphics, (band.start+band.end)/2 * mapScale, 0x111010, (band.end - band.start) * 1.1 * mapScale)
  });

  starsContainer.addChild(orbitGraphics)
  Registry.systemObjects[systemSymbol].push(orbitGraphics)

  waypoints.filter(item => !item.orbitsSymbol && item.type !== 'MOON' && item.type !== 'ORBITAL_STATION').forEach(item => {
    const itemGroup = createSystemItem({
      waypoint: item,
      star: starData,
    })
    //
    const orbitingThings = waypoints.filter(orbitingThing => orbitingThing.orbitsSymbol === item.symbol || (orbitingThing.symbol !== item.symbol && orbitingThing.x == item.x && orbitingThing.y == item.y))
    orbitingThings.forEach((orbitingThing, index) => {
      const orbitingGroup = createSystemItem({
        star: starData,
        waypoint: orbitingThing,
        parent: item,
        rotation: (index+1) / orbitingThings.length * Math.PI * 2,
      }, 0.5, index)

      Registry.waypoints[orbitingThing.symbol] = orbitingGroup

      starsContainer.addChild(orbitingGroup)
      Registry.systemObjects[systemSymbol].push(orbitingGroup)
    })
    //
    Registry.waypoints[item.symbol] = itemGroup

    starsContainer.addChild(itemGroup)
    Registry.systemObjects[systemSymbol].push(itemGroup)
  })
}

export async function unloadSystem(systemSymbol: string) {
  if (!Registry.transformedSystems[systemSymbol]) {
    return;
  }
  Registry.transformedSystems[systemSymbol] = false

  Registry.systemObjects[systemSymbol].forEach(item => {
    starsContainer.removeChild(item)
  });
}
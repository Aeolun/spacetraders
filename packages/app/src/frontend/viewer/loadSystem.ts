import {trpc} from "@front/trpc";
import {starLayer, starsContainer, universeView} from "@front/viewer/UIElements";
import {
  getEntityData, getEntityPosition,
  getSelectedEntity,
  getSelectedEntityData,
  Registry,
  ShipData,
  System,
  WaypointData
} from "@front/viewer/registry";
import {mapScale, scale, systemCoordinates, systemDistanceMultiplier} from "@front/viewer/consts";
import {Text, Container, Graphics, Sprite, PointData} from "pixi.js";
import {positionShip, resetShipWaypoints} from "@front/viewer/positionShips";
import {loadedAssets} from "@front/viewer/assets";
// import {makeInteractiveAndSelectable} from "@front/viewer/makeInteractiveAndSelectable";
import {Waypoint} from "@common/prisma";
import {UniverseEntity} from "@front/viewer/universe-entity";
import {getStarPosition, getSystemPosition} from "@front/viewer/util";
import {getDistance} from "@common/lib/getDistance";
import {store} from "@front/ui/store";
import {selectionActions} from "@front/ui/slices/selection";
import {contextMenuActions} from "@front/ui/slices/context-menu";
import {clearMarketRoutes, displayExportMarkets, displayImportMarkets} from "@front/viewer/display-export-market";
import {renderUniverseJumpGraphics} from "@front/viewer/loadUniverse";

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
  if (item.exploreStatus === 'UNEXPLORED') {
    traits.push('uncharted')
  }
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

  let texture = loadedAssets.spritesheet.textures[`public/textures/planets/${data.waypoint.type}.png`]
  if (data.waypoint.type === 'ASTEROID') {
    if (data.waypoint.traits.find(i => i.symbol === "HOLLOWED_INTERIOR")) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/ASTEROID_HOLLOW.png`]
    }
    if (data.waypoint.traits.find(i => i.symbol === "MINERAL_DEPOSITS")) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/ASTEROID_MINERAL.png`]
    }
    if (data.waypoint.traits.find(i => i.symbol === "RARE_METAL_DEPOSITS")) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/ASTEROID_RARE.png`]
    }
    if (data.waypoint.traits.find(i => i.symbol === "PRECIOUS_METAL_DEPOSITS")) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/ASTEROID_UNCOMMON.png`]
    }
  }
  if (data.waypoint.type === 'PLANET') {
    if (data.waypoint.traits.find(i => i.symbol === 'DRY_SEABEDS')) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/PLANET_DRY_SEABEDS.png`]
    }
    if (data.waypoint.traits.find(i => i.symbol === 'VOLCANIC')) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/PLANET_LAVA.png`]
    }
    if (data.waypoint.traits.find(i => i.symbol === 'OCEANIC')) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/PLANET_WATER.png`]
    }
    if (data.waypoint.traits.find(i => i.symbol === 'JUNGLE')) {
      texture = loadedAssets.spritesheet.textures[`public/textures/planets/PLANET_JUNGLE.png`]
    }
  }

  const waypointOnlyName = data.waypoint.symbol.replace(data.waypoint.systemSymbol+'-', '')
  const universeEntity = new UniverseEntity({
    texture,
    label: waypointOnlyName + ' - ' + data.waypoint.type,
    traits: getTraitIcons(data.waypoint),
    rotation: data.waypoint.type === 'ASTEROID' ? Math.random() * Math.PI * 2 : 0,
    position: position,
    scale: scale,
    tint: data.waypoint.type === 'ASTEROID' && data.waypoint.modifiers.find(m => m.symbol === 'UNSTABLE') ? 0xFF8888 : 0xffffff,
    onSelect: () => {
      Registry.deselect()
      Registry.selected = {
        type: 'waypoint',
        symbol: data.waypoint.symbol,
      }
      store.dispatch(selectionActions.setSelection({
        type: 'waypoint',
        symbol: data.waypoint.symbol,
      }))
      clearMarketRoutes()
      displayImportMarkets(data.waypoint.systemSymbol, data.waypoint.symbol, data.waypoint.tradeGoods.filter(tg => tg.kind === 'EXPORT').map(tg => tg.tradeGoodSymbol))
      displayExportMarkets(data.waypoint.systemSymbol, data.waypoint.symbol, data.waypoint.tradeGoods.filter(tg => tg.kind === 'IMPORT').map(tg => tg.tradeGoodSymbol))
    },
    onHover: (entity) => {
      const selectedEntity = getSelectedEntityData();
      if (selectedEntity && entity.text) {
        entity.text.text = waypointOnlyName + ' - ' + data.waypoint.type+`\n${Math.round(getDistance(getEntityPosition(data.waypoint.symbol), getEntityPosition(selectedEntity.symbol)))} LY Away`
      } else if (entity.text) {
        entity.text.text = waypointOnlyName + ' - ' + data.waypoint.type
      }
    },
    onRightClick: (event, entity) => {
      store.dispatch(contextMenuActions.open({x: event.globalX, y: event.globalY}))
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
  Registry.waypointsForSystem[systemSymbol] = waypoints
  waypoints.forEach(waypoint => {
    Registry.waypointData[waypoint.symbol] = waypoint
  })

  const starData = Registry.systemData[systemSymbol]
  if (!Registry.systemObjects[systemSymbol]) {
    Registry.systemObjects[systemSymbol] = []
  }

  if (!Registry.transformedSystems[systemSymbol]) {
    // unloaded while we were waiting for query to return
    return;
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

  let startBand: number | undefined = undefined, lastBand: number | undefined = undefined
  waypoints.filter(item => item.type === 'ASTEROID').forEach(item => {
    if (!startBand) {
      startBand = getDistance(item, centerPoint)
    }
    if (getDistance(item, centerPoint) - startBand > 100 && lastBand) {
      asteroidBands.push({
        start: startBand,
        end: lastBand
      })
      startBand = getDistance(item, centerPoint)
    }
    lastBand = getDistance(item, centerPoint)
  })
  if (startBand && lastBand) {
    asteroidBands.push({
      start: startBand,
      end: lastBand
    })
  }

  const starPos = getStarPosition(starData);
  const orbitGraphics = new Graphics();
  orbitGraphics.alpha = 0.5
  orbitGraphics.eventMode = 'none'
  orbitGraphics.x = starPos.x
  orbitGraphics.y = starPos.y
  orbitGraphics.zIndex = -1

  const jumpGraphics = new Graphics();
  jumpGraphics.alpha = 0.5
  jumpGraphics.eventMode = 'none'
  jumpGraphics.x = starPos.x
  jumpGraphics.y = starPos.y
  jumpGraphics.zIndex = -1


  waypoints.filter(item => !item.orbitsSymbol && item.type !== 'ASTEROID' && item.type !== 'MOON' && item.type !== 'ORBITAL_STATION').forEach(item => {
    const diameter = Math.sqrt(Math.pow(item.x, 2) + Math.pow(item.y, 2)) * mapScale
    createOrbitGraphics(orbitGraphics, diameter)
  });
  asteroidBands.forEach(band => {
    createOrbitGraphics(orbitGraphics, (band.start+band.end)/2 * mapScale, 0x111010, (band.end - band.start) * 1.1 * mapScale)
  });

  for(const item of waypoints.filter(item => item.type === 'JUMP_GATE')) {
    // draw line from waypoint to target systems
    for(const targetWaypoint of item.jumpConnectedTo) {
      // add to universeJumpData
      if (!Registry.universeJumpData[item.systemSymbol]) {
        Registry.universeJumpData[item.systemSymbol] = []
      }
      Registry.universeJumpData[item.systemSymbol].push(targetWaypoint.symbol.split('-').slice(0, -1).join('-'))

      const targetSystemSymbol = targetWaypoint.symbol.slice(0, targetWaypoint.symbol.lastIndexOf('-'));

      const currentSystemData = Registry.systemData[item.systemSymbol]
      const targetSystemData = Registry.systemData[targetSystemSymbol]
      if (!targetSystemData) {
        console.error("Cannot find target system symbol", targetSystemSymbol)
        continue
      }

      const systemXDiff = targetSystemData.x - currentSystemData.x
      const systemYDiff = targetSystemData.y - currentSystemData.y

      jumpGraphics.stroke({
        width: 50,
        color: 0x555599,
      }).moveTo(item.x*mapScale, item.y*mapScale).lineTo((systemXDiff*mapScale*systemDistanceMultiplier + targetWaypoint.x*mapScale), (systemYDiff*mapScale*systemDistanceMultiplier+targetWaypoint.y*mapScale))
    }
  }

  starLayer.addChild(jumpGraphics)
  starLayer.addChild(orbitGraphics)
  Registry.systemObjects[systemSymbol].push(orbitGraphics)
  Registry.systemObjects[systemSymbol].push(jumpGraphics)

  for(const item of waypoints.filter(item => !item.orbitsSymbol && item.type !== 'MOON' && item.type !== 'ORBITAL_STATION')) {
    const itemGroup = createSystemItem({
      waypoint: item,
      star: starData,
    })
    Registry.waypoints[item.symbol] = itemGroup
    Registry.systemObjects[systemSymbol].push(itemGroup)
    const orbitingThings = waypoints.filter(orbitingThing => orbitingThing.orbitsSymbol === item.symbol || (orbitingThing.symbol !== item.symbol && orbitingThing.x == item.x && orbitingThing.y == item.y))
    if (orbitingThings.length > 0) {
      orbitGraphics.circle(item.x*mapScale, item.y*mapScale, 48).stroke({
        width: 2,
        color: 0x111111,
      })
    }
    for (let index = 0; index < orbitingThings.length; index++) {
      const orbitingThing = orbitingThings[index]
      const orbitingGroup = createSystemItem({
        star: starData,
        waypoint: orbitingThing,
        parent: item,
        rotation: (index+1) / orbitingThings.length * Math.PI * 2,
      }, 0.5, index)

      Registry.waypoints[orbitingThing.symbol] = orbitingGroup

      Registry.systemObjects[systemSymbol].push(orbitingGroup)
    }
  }
}

export function unloadSystem(systemSymbol: string) {
  if (!Registry.transformedSystems[systemSymbol]) {
    return;
  }
  delete Registry.transformedSystems[systemSymbol]

  if (Registry.systemObjects[systemSymbol]) {
    console.log(`unloading ${Registry.systemObjects[systemSymbol].length} entities`)
    for(const item of Registry.systemObjects[systemSymbol]) {

      if (item instanceof UniverseEntity) {
        console.log('unloading universeentity')
        item.unload()
      } else {
        console.log('unloading sprite', item)
        starLayer.removeChild(item)
      }
    }
    Registry.systemObjects[systemSymbol] = []
  }
}
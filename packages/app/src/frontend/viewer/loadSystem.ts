import {trpc} from "@front/trpc";
import {starsContainer, universeView} from "@front/viewer/UIElements";
import {Registry, ShipData, System, WaypointData} from "@front/viewer/registry";
import {mapScale, systemCoordinates} from "@front/viewer/consts";
import {Text, Container, Graphics, Sprite, PointData} from "pixi.js";
import {positionShip, resetShipWaypoints} from "@front/viewer/positionShips";
import {loadedAssets} from "@front/viewer/assets";
// import {makeInteractiveAndSelectable} from "@front/viewer/makeInteractiveAndSelectable";
import {Waypoint} from "@common/prisma";
import {UniverseEntity} from "@front/viewer/universe-entity";

function createShipContainer(ship: ShipData) {
  const shipGroup = new Container()

  const itemSprite = new Sprite(loadedAssets.spaceshipTextures[ship.frameSymbol] ? loadedAssets.spaceshipTextures[ship.frameSymbol] : loadedAssets.spaceshipTexture)
  itemSprite.name = 'ship'
  itemSprite.pivot = {
    x: 32,
    y: 32
  }
  const navSprite = new Sprite(loadedAssets.navArrow);
  navSprite.pivot = {
    x: navSprite.width / 2,
    y: navSprite.height / 2,
  }
  navSprite.name = 'nav'
  navSprite.visible = false;
  shipGroup.addChild(navSprite)

  itemSprite.scale = { x: 0.5, y: 0.5 }
  const shipPosition = positionShip(ship)
  shipGroup.x = shipPosition.x
  shipGroup.y = shipPosition.y

  if (ship.agent !== Registry.agent.symbol) {
    itemSprite.tint = 0xDD9999
  }

  shipGroup.addChild(itemSprite)

  const text = new Text({
    text: ship.symbol + ' - ' + ship.role,
    renderMode: 'bitmap',
    style: {
      fontFamily: 'sans-serif',
      fontSize: 16,
      align: 'right',
    }
  })
  text.visible = false
  text.x = 0
  text.y = 32
  shipGroup.addChild(text);

  // makeInteractiveAndSelectable(shipGroup, {
  //   onMouseOver: () => {
  //     text.visible = true
  //   },
  //   onMouseOut: () => {
  //     text.visible = false
  //   },
  //   onSelect: {
  //     type: 'ship',
  //     symbol: ship.symbol
  //   }
  // })

  return shipGroup
}

function createOrbitGraphics(orbit: Graphics, item: Waypoint) {
  const diameter = Math.sqrt(Math.pow(item.x, 2) + Math.pow(item.y, 2)) * mapScale
  orbit.circle(0, 0, diameter).stroke({
    width: 2,
    color: 0x444444
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
  }, scale = 1, index = 0) {

  let position = { x: 0, y: 0}
  if (data.parent) {
    position.x = data.star.x * mapScale + data.parent.x + 32
    position.y = data.star.y * mapScale + data.parent.y + 48 + 64*index
  } else {
    position.x = (data.waypoint.x + data.star.x) * mapScale
    position.y = (data.waypoint.y + data.star.y) * mapScale
  }

  const universeEntity = new UniverseEntity({
    texture: loadedAssets.planetsheet.textures[`planets/tile/${data.waypoint.type}.png`],
    label: data.waypoint.symbol + ' - ' + data.waypoint.type,
    traits: getTraitIcons(data.waypoint),
    position: position,
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

  const orbitGraphics = new Graphics();
  orbitGraphics.eventMode = 'none'
  orbitGraphics.x = starData.x * mapScale
  orbitGraphics.y = starData.y * mapScale
  waypoints.filter(item => !item.orbitsSymbol && item.type !== 'MOON' && item.type !== 'ORBITAL_STATION').forEach(item => {
    createOrbitGraphics(orbitGraphics, item)
  });

  starsContainer.addChild(orbitGraphics)
  Registry.systemObjects[systemSymbol].push(orbitGraphics)

  waypoints.filter(item => !item.orbitsSymbol && item.type !== 'MOON' && item.type !== 'ORBITAL_STATION').forEach(item => {
    const itemGroup = createSystemItem({
      waypoint: item,
      star: starData,
    })
    //
    // waypoints.filter(orbitingThing => orbitingThing.orbitsSymbol === item.symbol || (orbitingThing.symbol !== item.symbol && orbitingThing.x == item.x && orbitingThing.y == item.y)).forEach((orbitingThing, index) => {
    //   const orbitingGroup = createSystemItem({
    //     waypoint: orbitingThing,
    //     parent: item
    //   }, 0.5, index)
    //
    //   Registry.waypoints[orbitingThing.symbol] = orbitingGroup
    //
    //   universeView.addChild(orbitingGroup)
    // })
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
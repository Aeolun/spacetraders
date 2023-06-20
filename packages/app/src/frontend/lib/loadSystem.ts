import {trpc} from "@front/lib/trpc";
import {systemGraphics, systemGraphicsText, systemView, universeView} from "@front/lib/UIElements";
import {GameState, ShipData, System, Waypoint, WaypointData} from "@front/lib/game-state";
import {systemCoordinates, systemScale} from "@front/lib/consts";
import {AnimatedSprite, BitmapText, Container, Graphics, Sprite} from "pixi.js";
import {positionShip, resetShipWaypoints} from "@front/lib/positionShips";
import {loadedAssets} from "@front/lib/assets";
import {makeInteractiveAndSelectable} from "@front/lib/makeInteractiveAndSelectable";
import {backButton} from "@front/lib/createSidebar";

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

  if (ship.agent !== GameState.agent.symbol) {
    itemSprite.tint = 0xDD9999
  }

  shipGroup.addChild(itemSprite)

  const text = new BitmapText(ship.symbol + ' - ' + ship.role, {
    fontName: 'sans-serif',
    fontSize: 16,
    align: 'right',
  })
  text.visible = false
  text.x = 0
  text.y = 32
  shipGroup.addChild(text);

  makeInteractiveAndSelectable(shipGroup, {
    onMouseOver: () => {
      text.visible = true
    },
    onMouseOut: () => {
      text.visible = false
    },
    onSelect: {
      type: 'ship',
      symbol: ship.symbol
    }
  })

  return shipGroup
}

function createOrbitGraphics(item: Waypoint) {
  const orbit = new Graphics()
  orbit.lineStyle({
    width: 2,
    color: 0x444444
  })
  orbit.drawCircle(Math.abs(systemCoordinates.minX)*systemScale, Math.abs(systemCoordinates.minY)*systemScale, Math.sqrt(Math.pow(item.x*systemScale, 2) + Math.pow(item.y*systemScale, 2)))

  return orbit
}

function addTraitIcons(item: WaypointData, container: Container) {
  let xOffset = 0
  item.traits.forEach(trait => {
    if (trait.symbol === 'MARKETPLACE') {
      const sprite = new Sprite(loadedAssets.market)
      sprite.pivot = {
        x: 32,
        y: 32
      }
      sprite.scale = {x: 0.25, y: 0.25}
      sprite.x = xOffset - 16
      sprite.y =  24
      container.addChild(sprite)
      xOffset += 16
    }
    if (trait.symbol === 'SHIPYARD') {
      const sprite = new Sprite(loadedAssets.shipyard)
      sprite.pivot = {
        x: 32,
        y: 32
      }
      sprite.scale = {x: 0.25, y: 0.24}
      sprite.x = xOffset - 16
      sprite.y = 24
      container.addChild(sprite)
      xOffset += 16
    }
  })
}

function createSystemItem(data: {
    waypoint: WaypointData
    parent?: WaypointData
  }, scale = 1, index = 0) {
  const orbitingGroup = new Container()

  let orbitingSprite: Sprite | AnimatedSprite;
  if (data.waypoint.type === 'PLANET') {
    orbitingSprite = new AnimatedSprite(loadedAssets.planet.animations['planet/tile/planet.png_spin'], true)
    if (orbitingSprite instanceof AnimatedSprite) {
      orbitingSprite.animationSpeed = 1/20
      orbitingSprite.play()
    }
  } else {
    orbitingSprite = new Sprite(loadedAssets.planetsheet.textures[`planets/tile/${data.waypoint.type}.png`])
  }
  orbitingSprite.pivot = {
    x: 32,
    y: 32
  }
  orbitingSprite.scale = {x: scale, y: scale}

  if (data.parent) {
    orbitingGroup.x = data.parent.x * systemScale + 32 + Math.abs(systemCoordinates.minX) * systemScale
    orbitingGroup.y = data.parent.y * systemScale + 48 + 64*index + Math.abs(systemCoordinates.minY) * systemScale
  } else {
    orbitingGroup.x = (data.waypoint.x + Math.abs(systemCoordinates.minX)) * systemScale
    orbitingGroup.y = (data.waypoint.y + Math.abs(systemCoordinates.minY)) * systemScale
  }

  orbitingGroup.addChild(orbitingSprite)

  const orbitingText = new BitmapText(data.waypoint.symbol + ' - ' + data.waypoint.type, {
    fontName: 'sans-serif',
    fontSize: 16,
    align: 'right',
  })
  orbitingText.x = 24
  orbitingText.y = -8
  orbitingText.visible = false
  orbitingGroup.addChild(orbitingText)

  makeInteractiveAndSelectable(orbitingGroup, {
    onMouseOver: () => {
      console.log('hovered', data.waypoint)
      GameState.hoveredWaypoint = data.waypoint
      orbitingText.visible = true
    },
    onMouseOut: () => {
      GameState.hoveredWaypoint = undefined
      orbitingText.visible = false
    },
    onSelect: {
      type: 'waypoint',
      symbol: data.waypoint.symbol,
    },
    onOrder: [
      {
        name: "navigate",
        withSelection: 'ship',
        action: async (selectedSymbol: string) => {
          const res = await trpc.instructNavigate.mutate({
            shipSymbol: selectedSymbol,
            waypointSymbol: data.waypoint.symbol,
          })
          GameState.shipData[res.symbol] = res
          console.log("updated state for ship "+res.symbol)
        }
      }
    ]
  })

  addTraitIcons(data.waypoint, orbitingGroup)

  return orbitingGroup
}

export function clearSystem() {
  systemView.removeChildren()
  systemView.addChild(systemGraphics)
  systemView.addChild(systemGraphicsText)
}

export function showSystemView() {
  universeView.visible = false
  systemView.visible = true
  GameState.currentView = 'system'
}

export async function loadSystem(systemSymbol: string, resetCamera = true) {
  Promise.all([
    trpc.shipsForSystem.query({
      system: systemSymbol
    }),
    trpc.waypointsForSystem.query({
      system: systemSymbol,
    })
  ]).then(([ships, waypoints]) => {
    const starData = GameState.systemData[systemSymbol]

    ships.forEach(ship => {
      GameState.shipData[ship.symbol] = ship
    })
    waypoints.forEach(waypoint => {
      GameState.waypointData[waypoint.symbol] = {
        ...waypoint,
        offset: Math.random()
      }
    })

    clearSystem()
    showSystemView()
    GameState.currentSystem = systemSymbol

    backButton.disabled = false

    systemCoordinates.minX = 0
    systemCoordinates.minY = 0
    waypoints.filter(item => !item.orbitsSymbol).forEach(item => {
      if (item.x < systemCoordinates.minX) {
        systemCoordinates.minX = item.x
      }
      if (item.y < systemCoordinates.minY) {
        systemCoordinates.minY = item.y
      }
    })

    let texture = loadedAssets.sheet.textures[`planets/tile/${starData.type}.png`]
    const star = new Sprite(texture)
    star.x = Math.abs(systemCoordinates.minX) * systemScale
    star.y = Math.abs(systemCoordinates.minY) * systemScale
    star.pivot = {
      x: 32,
      y: 32
    }
    systemView.addChild(star)

    resetShipWaypoints()
    GameState.systemShips = {}
    GameState.waypoints = {}

    Object.values(GameState.shipData).filter(ship => ship.currentWaypoint.systemSymbol === starData.symbol).forEach(data => {
      const ship = data

      const shipGroup = createShipContainer(ship)

      systemView.addChild(shipGroup)
      GameState.systemShips[ship.symbol] = shipGroup
    })

    waypoints.filter(item => !item.orbitsSymbol && item.type !== 'MOON' && item.type !== 'ORBITAL_STATION').forEach(item => {
      systemView.addChild(createOrbitGraphics(item))

      const itemGroup = createSystemItem({
        waypoint: item
      })

      waypoints.filter(orbitingThing => orbitingThing.orbitsSymbol === item.symbol || (orbitingThing.symbol !== item.symbol && orbitingThing.x == item.x && orbitingThing.y == item.y)).forEach((orbitingThing, index) => {
        const orbitingGroup = createSystemItem({
          waypoint: orbitingThing,
          parent: item
        }, 0.5, index)

        GameState.waypoints[orbitingThing.symbol] = orbitingGroup

        systemView.addChild(orbitingGroup)
      })

      GameState.waypoints[item.symbol] = itemGroup

      systemView.addChild(itemGroup)
    })

    if (resetCamera) {
      systemView.moveCenter({
        x: Math.abs(systemCoordinates.minX) * systemScale,
        y: Math.abs(systemCoordinates.minY) * systemScale
      })
    }
  })
}
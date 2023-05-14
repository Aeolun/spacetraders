import {trpc} from "@app/lib/trpc";
import {backButton, systemView, universeView} from "@app/lib/UIElements";
import {GameState, WaypointData} from "@app/lib/game-state";
import {systemCoordinates, systemScale} from "@app/lib/consts";
import {BitmapText, Container, Graphics, Sprite} from "pixi.js";
import {positionShip, resetShipWaypoints} from "@app/lib/positionShips";
import {loadedAssets} from "@app/lib/assets";
import {makeInteractiveAndSelectable} from "@app/lib/makeInteractiveAndSelectable";

export async function loadSystem(systemSymbol: string) {
  trpc.waypointsForSystem.query({
    system: systemSymbol,
  }).then(waypoints => {
    console.log('result from query', result)
    universeView.visible = false
    systemView.visible = true
    GameState.currentView = 'system'

    systemCoordinates.minX = 0
    systemCoordinates.minY = 0
    result.waypoints.filter(item => !item.orbitsSymbol).forEach(item => {
      if (item.x < systemCoordinates.minX) {
        systemCoordinates.minX = item.x
      }
      if (item.y < systemCoordinates.minY) {
        systemCoordinates.minY = item.y
      }
    })

    const star = new Sprite(texture)
    star.x = Math.abs(systemCoordinates.minX) * systemScale
    star.y = Math.abs(systemCoordinates.minY) * systemScale
    star.pivot = {
      x: 32,
      y: 32
    }
    systemView.addChild(star)

    backButton.visible = true

    resetShipWaypoints()
    GameState.visibleShips = {}
    GameState.visibleWaypoints = {}
    Object.values(GameState.myShips).forEach(data => {
      const ship = data.shipData

      const shipGroup = new Container()

      const itemSprite = new Sprite(loadedAssets.spaceshipTexture)
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

      systemView.addChild(shipGroup)
      GameState.visibleShips[ship.symbol] = {
        shipData: ship,
        container: shipGroup
      }
    })

    const addTraitIcons = (item: WaypointData, container: Container) => {
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

    result.waypoints.filter(item => !item.orbitsSymbol).forEach(item => {
      const orbit = new Graphics()
      orbit.lineStyle({
        width: 2,
        color: 0x444444
      })
      orbit.drawCircle(Math.abs(systemCoordinates.minX)*systemScale, Math.abs(systemCoordinates.minY)*systemScale, Math.sqrt(Math.pow(item.x*systemScale, 2) + Math.pow(item.y*systemScale, 2)))
      systemView.addChild(orbit)

      const itemGroup = new Container()
      makeInteractiveAndSelectable(itemGroup, {
        onSelect: {
          type: 'waypoint',
          symbol: item.symbol,
        },
        onOrder: [
          {
            name: "navigate",
            withSelection: 'ship',
            action: async (selectedSymbol: string) => {
              const res = await trpc.instructNavigate.mutate({
                shipSymbol: selectedSymbol,
                waypointSymbol: item.symbol,
              })
              GameState.visibleShips[res.symbol].shipData = res
              console.log("updated state for ship "+res.symbol)
            }
          }
        ]
      })

      const itemSprite = new Sprite(loadedAssets.planetsheet.textures[`planets/tile/${item.type}.png`])
      itemSprite.pivot = {
        x: 32,
        y: 32
      }
      itemGroup.x = (item.x + Math.abs(systemCoordinates.minX)) * systemScale
      itemGroup.y = (item.y + Math.abs(systemCoordinates.minY)) * systemScale
      itemGroup.addChild(itemSprite)

      const text = new BitmapText(item.symbol.replace(starData.symbol+'-', '') + ' - ' + item.type, {
        fontName: 'sans-serif',
        fontSize: 16,
        align: 'right',
      })
      text.x = 40
      text.y = -8
      itemGroup.addChild(text);

      addTraitIcons(item, itemGroup)

      result.waypoints.filter(orbitingThing => orbitingThing.orbitsSymbol === item.symbol).forEach((orbitingThing, index) => {
        const orbitingGroup = new Container()
        makeInteractiveAndSelectable(orbitingGroup, {
          onSelect: {
            type: 'waypoint',
            symbol: orbitingThing.symbol,
          },
        })

        const orbitingSprite = new Sprite(loadedAssets.planetsheet.textures[`planets/tile/${orbitingThing.type}.png`])
        orbitingSprite.pivot = {
          x: 32,
          y: 32
        }
        orbitingSprite.scale = {x: 0.75, y: 0.75}
        orbitingGroup.x = item.x * systemScale + 32 + Math.abs(systemCoordinates.minX) * systemScale
        orbitingGroup.y = item.y * systemScale + 48 + 64*index + Math.abs(systemCoordinates.minY) * systemScale
        orbitingGroup.addChild(orbitingSprite)

        const orbitingText = new BitmapText(orbitingThing.symbol.replace(starData.symbol+'-', '') + ' - ' + orbitingThing.type, {
          fontName: 'sans-serif',
          fontSize: 16,
          align: 'right',
        })
        orbitingText.x = 24
        orbitingText.y = -8
        orbitingGroup.addChild(orbitingText)

        addTraitIcons(orbitingThing, orbitingGroup)

        GameState.visibleWaypoints[orbitingThing.symbol] = {
          waypointData: orbitingThing,
          container: orbitingGroup
        }

        systemView.addChild(orbitingGroup)
      })

      GameState.visibleWaypoints[item.symbol] = {
        waypointData: item,
        container: itemGroup
      }

      systemView.addChild(itemGroup)
    })

    systemView.moveCenter({
      x: Math.abs(systemCoordinates.minX) * systemScale,
      y: Math.abs(systemCoordinates.minY) * systemScale
    })
  })
}
import {BitmapText, Container, DisplayObject, Graphics, Sprite} from "pixi.js";
import { trpc } from '@app/lib/trpc'
import { makeInteractiveAndSelectable } from "@app/lib/makeInteractiveAndSelectable";
import {loadedAssets} from "@app/lib/assets";
import {systemCoordinates, systemScale, totalSize, universeCoordinates} from "@app/lib/consts";
import {backButton, systemView, uiOverlay, universeView} from "@app/lib/UIElements";
import {GameState} from "@app/lib/game-state";
import {positionShip, resetShipWaypoints} from "@app/lib/positionShips";

export const loadUniverse = async () => {
    const references: Record<string, Container<DisplayObject>> = {}

    const systems = await trpc.getSystems.query()

    for(const starData of systems) {
        if (starData.x < universeCoordinates.minX) universeCoordinates.minX = starData.x
        if (starData.x > universeCoordinates.maxX) universeCoordinates.maxX = starData.x
        if (starData.y < universeCoordinates.minY) universeCoordinates.minY = starData.y
        if (starData.y > universeCoordinates.maxY) universeCoordinates.maxY = starData.y
    }

    for(const starData of systems) {
        let texture = loadedAssets.sheet.textures[`planets/tile/${starData.type}.png`]

        const star = new Sprite(texture)
        star.pivot = {
            x: 32,
            y: 32
        }
        const text = new BitmapText(starData.name+'\n('+starData.symbol+')', {
            fontName: 'sans-serif',
            fontSize: 18,
            align: 'left',
        })
        text.x = 0
        text.y = 40

        const starContainer = new Container();
        starContainer.addChild(star)
        starContainer.addChild(text)

        makeInteractiveAndSelectable(starContainer)

        starContainer.on('click', () => {
            trpc.dataForDisplay.query({
                system: starData.symbol,
            }).then(result => {
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
                GameState.visibleShips = []
                result.ships.forEach(ship => {
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
                    GameState.visibleShips.push({
                        shipData: ship,
                        container: shipGroup
                    })
                })

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
                                    GameState.visibleShips.forEach(ship => {
                                        if (ship.shipData.symbol === res.symbol) {
                                            ship.shipData = res
                                            console.log("updated state for ship "+res.symbol)
                                        }
                                    })
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

                        systemView.addChild(orbitingGroup)
                    })

                    systemView.addChild(itemGroup)
                })

                systemView.moveCenter({
                    x: Math.abs(systemCoordinates.minX) * systemScale,
                    y: Math.abs(systemCoordinates.minY) * systemScale
                })
            })
        })

        starContainer.x = (starData.x+Math.abs(universeCoordinates.minX))/(universeCoordinates.maxX-universeCoordinates.minX)*totalSize
        starContainer.y = (starData.y+Math.abs(universeCoordinates.minY))/(universeCoordinates.maxY-universeCoordinates.minY)*totalSize

        universeView.addChild(starContainer)
        references[starData.symbol] = starContainer
    }

    const graphics = new Graphics()
    graphics.lineStyle({
        width: 15,
        color: 0x0077FF
    })
    const multiFactor = 5000 / (universeCoordinates.maxX-universeCoordinates.minX) * totalSize
    graphics.drawCircle(references['X1-VU95'].x, references['X1-VU95'].y, multiFactor)
    graphics.moveTo(references['X1-VU95'].x, references['X1-VU95'].y)
    graphics.lineTo(references['X1-FS18'].x, references['X1-FS18'].y)
    graphics.moveTo(references['X1-VU95'].x, references['X1-VU95'].y)
    graphics.lineTo(references['X1-AA92'].x, references['X1-AA92'].y)
    graphics.moveTo(references['X1-VU95'].x, references['X1-VU95'].y)
    graphics.lineTo(references['X1-JQ84'].x, references['X1-JQ84'].y)


    universeView.addChild(graphics)

    universeView.moveCenter(references['X1-VU95'].x, references['X1-VU95'].y)

    return {
        systems: references
    }
}
import {BitmapText, Container, DisplayObject, Graphics, Sprite} from "pixi.js";
import { trpc } from '@app/lib/trpc'
import { makeInteractiveAndSelectable } from "@app/lib/makeInteractiveAndSelectable";
import {loadedAssets} from "@app/lib/assets";
import {scale, systemCoordinates, systemScale, totalSize, universeCoordinates, universeScale} from "@app/lib/consts";
import {backButton, systemView, uiOverlay, universeView} from "@app/lib/UIElements";
import {GameState, System, WaypointData} from "@app/lib/game-state";
import {positionShip, resetShipWaypoints} from "@app/lib/positionShips";
import {loadSystem} from "@app/lib/loadSystem";


const addTraitIcons = (item: any, container: Container) => {
    let xOffset = 0, hasMarket = false, hasShipyard = false, hasBelt = false
    item.waypoints.forEach(waypoint => {
        waypoint.traits.forEach(trait => {
            if (trait.symbol === 'MARKETPLACE') {
                hasMarket = true
            }
            if (trait.symbol === 'SHIPYARD') {
                hasShipyard = true
            }
            if (trait.symbol === 'COMMON_METAL_DEPOSITS' || trait.symbol === 'PRECIOUS_METAL_DEPOSITS' || trait.symbol === 'MINERAL_DEPOSITS') {
                hasBelt = true
            }
        })
    })
    if (hasMarket) {
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
    if (hasShipyard) {
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
    if (hasBelt) {
        const sprite = new Sprite(loadedAssets.asteroidBelt)
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
}
export const loadUniverse = async () => {
    const references: Record<string, Container<DisplayObject>> = {}

    const systems = await trpc.getSystems.query({})

    for(const starData of systems) {
        if (starData.x < universeCoordinates.minX) universeCoordinates.minX = starData.x
        if (starData.x > universeCoordinates.maxX) universeCoordinates.maxX = starData.x
        if (starData.y < universeCoordinates.minY) universeCoordinates.minY = starData.y
        if (starData.y > universeCoordinates.maxY) universeCoordinates.maxY = starData.y
    }

    GameState.visibleSystems = {}
    scale.universe = totalSize/(universeCoordinates.maxX-universeCoordinates.minX)

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

        addTraitIcons(starData, starContainer)

        GameState.visibleSystems[starData.symbol] = {
            systemData: starData,
            container: starContainer
        }

        makeInteractiveAndSelectable(starContainer, {
            onMouseOut: () => {
                GameState.hoveredSystem = undefined
            },
            onMouseOver: () => {
                GameState.hoveredSystem = starData
            },
            onOrder: [
                {
                    name: 'Warp',
                    withSelection: 'ship',
                    action: async () => {
                        if (GameState.selected?.symbol) {

                            const waypoints: WaypointData[] = await trpc.waypointsForSystem.query({
                                system: starData.symbol
                            });
                            console.log('waypoints', waypoints)
                            const bestWaypoint = waypoints.find(w => w.traits.find(t => t.symbol === 'MARKETPLACE'))?.symbol ?? waypoints[0].symbol
                            if (bestWaypoint) {
                                console.log("warping to ", bestWaypoint)
                                const res = await trpc.instructWarp.mutate({
                                    shipSymbol: GameState.selected.symbol,
                                    waypointSymbol: bestWaypoint
                                })

                                GameState.myShips[res.symbol].shipData = res
                            } else {
                                alert("Cannot warp to system without waypoints, nothing to target")
                            }
                        }
                    }
                }
            ]
        })

        starContainer.on('click', () => {
            loadSystem(starData)
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
    // graphics.drawCircle(references['X1-VU95'].x, references['X1-VU95'].y, multiFactor)
    // graphics.moveTo(references['X1-VU95'].x, references['X1-VU95'].y)
    // graphics.lineTo(references['X1-FS18'].x, references['X1-FS18'].y)
    // graphics.moveTo(references['X1-VU95'].x, references['X1-VU95'].y)
    // graphics.lineTo(references['X1-AA92'].x, references['X1-AA92'].y)
    // graphics.moveTo(references['X1-VU95'].x, references['X1-VU95'].y)
    // graphics.lineTo(references['X1-JQ84'].x, references['X1-JQ84'].y)

    const commandShip = Object.values(GameState.myShips).find(ship => ship.shipData.role === 'COMMAND')
    const commandShipLocation = commandShip?.shipData.currentWaypoint.systemSymbol

    universeView.addChild(graphics)

    if (commandShipLocation) {
        universeView.moveCenter(references[commandShipLocation].x, references[commandShipLocation].y)
    }

    return {
        systems: references
    }
}
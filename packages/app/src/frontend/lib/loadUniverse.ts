import {AlphaFilter, BitmapText, BLEND_MODES, Container, DisplayObject, Graphics, Sprite} from "pixi.js";
import {trpc} from '@front/lib/trpc'
import {deselectListeners, makeInteractiveAndSelectable} from "@front/lib/makeInteractiveAndSelectable";
import {loadedAssets} from "@front/lib/assets";
import {scale, totalSize, universeCoordinates,} from "@front/lib/consts";
import {behaviorWindow, universeCuller, universeView} from "@front/lib/UIElements";
import {GameState, System, WaypointData} from "@front/lib/game-state";
import {positionUniverseShip, resetShipWaypoints} from "@front/lib/positionShips";
import {loadSystem} from "@front/lib/loadSystem";
import {getDistance} from "@common/lib/getDistance";
import {convertToDisplayCoordinates} from "@front/lib/util";
import {highlightmodes} from "@front/lib/highlightmodes";


const addTraitIcons = (item: System, container: Container) => {
    let xOffset = 0
    if (item.hasMarket) {
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
    if (item.hasShipyard) {
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
    if (item.hasBelt) {
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
    if (item.hasJumpGate) {
        const sprite = new Sprite(loadedAssets.jumpgate)
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
    if (item.hasStation && !item.hasShipyard) {
        const sprite = new Sprite(loadedAssets.station)
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
    if (item.hasUncharted) {
        const sprite = new Sprite(loadedAssets.treasure)
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



function createStar(starData: System) {
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
    text.name = 'label'
    text.x = 0
    text.y = 40

    const starContainer = new Container();
    starContainer.addChild(star)
    starContainer.addChild(text)

    addTraitIcons(starData, starContainer)

    makeInteractiveAndSelectable(starContainer, {
        onMouseOut: () => {
            GameState.hoveredSystem = undefined

        },
        onMouseOver: () => {
            GameState.hoveredSystem = starData
        },
        onOrder: [
            {
                name: 'Travel',
                withSelection: 'ship',
                isAvailable: async () => {
                    return true
                },
                action: async () => {
                    await trpc.orderTravel.mutate({
                        shipSymbol: GameState.selected.symbol,
                        systemSymbol: starData.symbol
                    });
                }
            },
            {
                name: 'Warp',
                withSelection: 'ship',
                isAvailable: async () => {
                    const shipData = GameState.shipData[GameState.selected.symbol]
                    const warpRange = shipData.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
                    const currentSystem = GameState.systemData[shipData.currentWaypoint.systemSymbol]
                    return getDistance(currentSystem, GameState.hoveredSystem) < warpRange
                },
                action: async () => {
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

                        GameState.shipData[res.symbol] = res
                    } else {
                        alert("Cannot warp to system without waypoints, nothing to target")
                    }
                }
            },
            {
                name: 'Jump using gate',
                withSelection: 'ship',
                isAvailable: async () => {
                    const shipData = GameState.shipData[GameState.selected.symbol]

                    const currentSystemWaypoints: WaypointData[] = await trpc.waypointsForSystem.query({
                        system: shipData.currentWaypoint.systemSymbol
                    });
                    const jumpGate = currentSystemWaypoints.find(wp => wp.type === 'JUMP_GATE' && wp.symbol === shipData.currentWaypoint.symbol)

                    console.log('deve', {currentSystemWaypoints, jumpGate})
                    return !!jumpGate
                },
                action: async () => {
                    const res = await trpc.instructJump.mutate({
                        shipSymbol: GameState.selected.symbol,
                        systemSymbol: starData.symbol
                    })
                    GameState.shipData[res.symbol] = res
                }
            },
            {
                name: 'Jump',
                withSelection: 'ship',
                isAvailable: async () => {
                    const shipData = GameState.shipData[GameState.selected.symbol]
                    const jumpRange = shipData.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value
                    const currentSystem = GameState.systemData[shipData.currentWaypoint.systemSymbol]
                    return !!GameState.selected?.symbol && getDistance(currentSystem, GameState.hoveredSystem) < jumpRange
                },
                action: async () => {
                    const res = await trpc.instructJump.mutate({
                        shipSymbol: GameState.selected.symbol,
                        systemSymbol: starData.symbol
                    })
                    GameState.shipData[res.symbol] = res
                }
            },
            {
                name: 'Set behavior',
                withSelection: 'ship',
                isAvailable: async () => {
                    return true
                },
                action: async (selectedSymbol) => {
                    behaviorWindow.show()
                    behaviorWindow.setHome(starData.symbol)
                    deselectListeners.once('deselect', () => {
                        behaviorWindow.hide()
                    })
                }
            }
        ]
    })

    starContainer.on('click', () => {
        loadSystem(starData.symbol)
    })

    const displayCoords = convertToDisplayCoordinates(starData)
    starContainer.x = displayCoords.x
    starContainer.y = displayCoords.y

    return starContainer
}

export const loadUniverse = async () => {
    const references: Record<string, Container<DisplayObject>> = {}

    const systems = await trpc.getSystems.query()

    for(const starData of systems) {
        GameState.systemData[starData.symbol] = starData

        if (starData.x < universeCoordinates.minX) universeCoordinates.minX = starData.x
        if (starData.x > universeCoordinates.maxX) universeCoordinates.maxX = starData.x
        if (starData.y < universeCoordinates.minY) universeCoordinates.minY = starData.y
        if (starData.y > universeCoordinates.maxY) universeCoordinates.maxY = starData.y
    }

    GameState.systems = {}
    scale.universe = totalSize/(universeCoordinates.maxX-universeCoordinates.minX)

    const influenceGraphics = new Graphics()
    highlightmodes.Factions(influenceGraphics)
    influenceGraphics.name = 'highlight'
    universeView.addChild(influenceGraphics);

    // draw jump connections
    const jumpGraphics = new Graphics()
    for(const starData of systems) {
        const jumpGate = starData.hasJumpGate
        if (jumpGate) {
            const validJumpTargets = systems.filter(s => getDistance(s, starData) <= 2000 && s.hasJumpGate && s.symbol !== starData.symbol)

            validJumpTargets.forEach(jumpTarget => {
                const displayCoords = convertToDisplayCoordinates(starData)
                const targetCoords = convertToDisplayCoordinates(jumpTarget)

                jumpGraphics.lineStyle({
                    width: 10,
                    color: 0x999933,
                    alpha: 0.05,
                })
                jumpGraphics.moveTo(displayCoords.x, displayCoords.y)
                jumpGraphics.lineTo(targetCoords.x, targetCoords.y)
                jumpGraphics.closePath()

            })

        }
    }
    universeView.addChild(jumpGraphics)

    const routeGraphics = new Graphics()
    routeGraphics.name = 'route'
    universeView.addChild(routeGraphics)

    const homeSystemGraphics = new Graphics()
    homeSystemGraphics.name = 'homeSystem'
    universeView.addChild(homeSystemGraphics)

    const starsCont = new Container()
    for(const starData of systems) {
        const starContainer = createStar(starData)

        GameState.systems[starData.symbol] = starContainer


        starsCont.addChild(starContainer)
        references[starData.symbol] = starContainer
    }
    universeView.addChild(starsCont)
    universeCuller.addList(starsCont.children)

    resetShipWaypoints()
    GameState.universeShips = {}
    Object.values(GameState.shipData).forEach(ship => {
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
        const shipPosition = positionUniverseShip(ship)
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

        universeView.addChild(shipGroup)
        GameState.universeShips[ship.symbol] = shipGroup
    })

    const graphics = new Graphics()
    graphics.lineStyle({
        width: 15,
        color: 0x0077FF
    })
    const multiFactor = 5000 / (universeCoordinates.maxX-universeCoordinates.minX) * totalSize


    const commandShip = Object.values(GameState.shipData).find(ship => ship.role === 'COMMAND')
    const commandShipLocation = commandShip?.currentWaypoint.systemSymbol

    universeView.addChild(graphics)

    if (commandShipLocation) {
        universeView.moveCenter(references[commandShipLocation].x, references[commandShipLocation].y)
    }

    return {
        systems: references
    }
}
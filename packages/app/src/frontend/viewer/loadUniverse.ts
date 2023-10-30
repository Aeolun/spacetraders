import {Text, Container, Graphics, Sprite} from "pixi.js";
import {trpc} from '@front/trpc'
// import {deselectListeners, makeInteractiveAndSelectable} from "@front/viewer/makeInteractiveAndSelectable";
import {loadedAssets} from "@front/viewer/assets";
import {scale, universeCoordinates,} from "@front/viewer/consts";
import { universeView, starsContainer} from "@front/viewer/UIElements";
import {Registry, System, WaypointData} from "@front/viewer/registry";
import {positionUniverseShip, resetShipWaypoints} from "@front/viewer/positionShips";
import {getDistance} from "@common/lib/getDistance";
import {convertToDisplayCoordinates} from "@front/viewer/util";
import {UniverseEntity} from "@front/viewer/universe-entity";
import {UniverseShip} from "@front/viewer/universe-ship";
// import {highlightmodes} from "@front/viewer/highlightmodes";


const getTraits = (item: System) => {
    const traits: string[] = []
    if (item.hasMarket) {
        traits.push('market')
    }
    if (item.hasShipyard) {
        traits.push('shipyard')
    }
    if (item.hasBelt) {
        traits.push('belt')
    }
    if (item.hasJumpGate) {
        traits.push('jumpgate')
    }
    if (item.hasStation && !item.hasShipyard) {
        traits.push('station')
    }
    if (item.hasUncharted) {
        traits.push('uncharted')
    }
    return traits
}



function createStar(starData: System) {
    let texture = loadedAssets.sheet.textures[`planets/tile/${starData.type}.png`]

    const star = new UniverseEntity({
        texture,
        traits: getTraits(starData),
        label: starData.name+'\n('+starData.symbol+')',
        position: convertToDisplayCoordinates(starData),
        onSelect: () => {
            Registry.deselect()
            Registry.selected = {
                type: 'star',
                symbol: starData.symbol,
            }
        }
    })

    // makeInteractiveAndSelectable(starContainer, {
    //     onMouseOut: () => {
    //         Registry.hoveredSystem = undefined
    //
    //     },
    //     onMouseOver: () => {
    //         Registry.hoveredSystem = starData
    //     },
    //     onOrder: [
    //         {
    //             name: 'Travel',
    //             withSelection: 'ship',
    //             isAvailable: async () => {
    //                 return true
    //             },
    //             action: async () => {
    //                 await trpc.orderTravel.mutate({
    //                     shipSymbol: Registry.selected.symbol,
    //                     systemSymbol: starData.symbol,
    //                 });
    //             }
    //         },
    //         {
    //             name: 'Warp',
    //             withSelection: 'ship',
    //             isAvailable: async () => {
    //                 const shipData = Registry.shipData[Registry.selected.symbol]
    //                 const warpRange = shipData.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
    //                 const currentSystem = Registry.systemData[shipData.currentWaypoint.systemSymbol]
    //                 return getDistance(currentSystem, Registry.hoveredSystem) < warpRange
    //             },
    //             action: async () => {
    //                 const waypoints: WaypointData[] = await trpc.waypointsForSystem.query({
    //                     system: starData.symbol
    //                 });
    //
    //                 console.log('waypoints', waypoints)
    //                 const bestWaypoint = waypoints.find(w => w.traits.find(t => t.symbol === 'MARKETPLACE'))?.symbol ?? waypoints[0].symbol
    //                 if (bestWaypoint) {
    //                     console.log("warping to ", bestWaypoint)
    //                     const res = await trpc.instructWarp.mutate({
    //                         shipSymbol: Registry.selected.symbol,
    //                         waypointSymbol: bestWaypoint
    //                     })
    //
    //                     Registry.shipData[res.symbol] = res
    //                 } else {
    //                     alert("Cannot warp to system without waypoints, nothing to target")
    //                 }
    //             }
    //         },
    //         {
    //             name: 'Jump using gate',
    //             withSelection: 'ship',
    //             isAvailable: async () => {
    //                 const shipData = Registry.shipData[Registry.selected.symbol]
    //
    //                 const currentSystemWaypoints: WaypointData[] = await trpc.waypointsForSystem.query({
    //                     system: shipData.currentWaypoint.systemSymbol
    //                 });
    //                 const jumpGate = currentSystemWaypoints.find(wp => wp.type === 'JUMP_GATE' && wp.symbol === shipData.currentWaypoint.symbol)
    //
    //                 console.log('deve', {currentSystemWaypoints, jumpGate})
    //                 return !!jumpGate
    //             },
    //             action: async () => {
    //                 const res = await trpc.instructJump.mutate({
    //                     shipSymbol: Registry.selected.symbol,
    //                     systemSymbol: starData.symbol
    //                 })
    //                 Registry.shipData[res.symbol] = res
    //             }
    //         },
    //         {
    //             name: 'Jump',
    //             withSelection: 'ship',
    //             isAvailable: async () => {
    //                 const shipData = Registry.shipData[Registry.selected.symbol]
    //                 const jumpRange = shipData.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value
    //                 const currentSystem = Registry.systemData[shipData.currentWaypoint.systemSymbol]
    //                 return !!Registry.selected?.symbol && getDistance(currentSystem, Registry.hoveredSystem) < jumpRange
    //             },
    //             action: async () => {
    //                 const res = await trpc.instructJump.mutate({
    //                     shipSymbol: Registry.selected.symbol,
    //                     systemSymbol: starData.symbol
    //                 })
    //                 Registry.shipData[res.symbol] = res
    //             }
    //         },
    //         {
    //             name: 'Set behavior',
    //             withSelection: 'ship',
    //             isAvailable: async () => {
    //                 return true
    //             },
    //             action: async (selectedSymbol) => {
    //                 behaviorWindow.show()
    //                 behaviorWindow.setHome(starData.symbol)
    //                 deselectListeners.once('deselect', () => {
    //                     behaviorWindow.hide()
    //                 })
    //             }
    //         }
    //     ]
    // })

    return star
}

const createShip = (ship: any) => {

    const shipPosition = positionUniverseShip(ship)

    const shipGroup = new UniverseShip({
        label: ship.symbol + ' - ' + ship.role,
        texture: loadedAssets.spaceshipTextures[ship.frameSymbol] ? loadedAssets.spaceshipTextures[ship.frameSymbol] : loadedAssets.spaceshipTexture,
        traits: [],
        position: shipPosition,
        onSelect: () => {
            Registry.deselect()
            Registry.selected = {
                type: 'ship',
                symbol: ship.symbol,
            }
        }
    })

    // const text = new Text({
    //     text: ship.symbol + ' - ' + ship.role,
    //     style: {
    //         fontFamily: 'sans-serif',
    //         fontSize: 16,
    //         align: 'right',
    //     }
    // })
    // text.visible = false
    // text.x = 0
    // text.y = 32
    // shipGroup.addChild(text);

    // makeInteractiveAndSelectable(shipGroup, {
    //     onMouseOver: () => {
    //         text.visible = true
    //     },
    //     onMouseOut: () => {
    //         text.visible = false
    //     },
    //     onSelect: {
    //         type: 'ship',
    //         symbol: ship.symbol
    //     }
    // })
    return shipGroup
}

export const loadUniverse = async () => {
    const references: Record<string, Container> = {}

    const systems = await trpc.getSystems.query()

    for(const starData of systems) {
        Registry.systemData[starData.symbol] = starData

        if (starData.x < universeCoordinates.minX) universeCoordinates.minX = starData.x
        if (starData.x > universeCoordinates.maxX) universeCoordinates.maxX = starData.x
        if (starData.y < universeCoordinates.minY) universeCoordinates.minY = starData.y
        if (starData.y > universeCoordinates.maxY) universeCoordinates.maxY = starData.y
    }

    Registry.systems = {}

    const influenceGraphics = new Graphics()
    // highlightmodes.Factions(influenceGraphics)
    influenceGraphics.name = 'highlight'
    universeView.addChild(influenceGraphics);

    // draw jump connections
    const jumpGraphics = new Graphics()
    for(const starData of systems) {
        const jumpGate = starData.hasJumpGate
        if (jumpGate && starData.jumpgateRange) {
            const validJumpTargets = systems.filter(s => getDistance(s, starData) <= starData.jumpgateRange && s.hasJumpGate && s.symbol !== starData.symbol)

            validJumpTargets.forEach(jumpTarget => {
                const displayCoords = convertToDisplayCoordinates(starData)
                const targetCoords = convertToDisplayCoordinates(jumpTarget)

                jumpGraphics.stroke({
                    width: starData.jumpgateRange / 250,
                    color: 0x999933,
                    alpha: 0.1,
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

    for(const starData of systems) {
        const starContainer = createStar(starData)

        Registry.systems[starData.symbol] = starContainer


        starsContainer.addChild(starContainer)
        references[starData.symbol] = starContainer
    }
    universeView.addChild(starsContainer)

    Registry.universeShips = {}
    Object.values(Registry.shipData).forEach(ship => {
        const shipContainer = createShip(ship)
        Registry.universeShips[ship.symbol] = shipContainer
        starsContainer.addChild(shipContainer)
    })
    // universeCuller.addList(starsCont.children)

    resetShipWaypoints()

    const graphics = new Graphics()
    graphics.stroke({
        width: 15,
        color: 0x0077FF
    })

    const commandShip = Object.values(Registry.shipData).find(ship => ship.role === 'COMMAND')
    const commandShipLocation = commandShip?.currentWaypoint.systemSymbol

    universeView.addChild(graphics)

    if (commandShipLocation) {
        universeView.moveCenter(references[commandShipLocation].x, references[commandShipLocation].y)
    }


    return {
        systems: references
    }
}
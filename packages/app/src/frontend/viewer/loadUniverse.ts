import {Text, Container, Graphics, Sprite} from "pixi.js";
import {trpc} from '@front/trpc'
// import {deselectListeners, makeInteractiveAndSelectable} from "@front/viewer/makeInteractiveAndSelectable";
import {loadedAssets} from "@front/viewer/assets";
import {scale, universeCoordinates,} from "@front/viewer/consts";
import {universeView, starsContainer, overlayLayer} from "@front/viewer/UIElements";
import {Registry, System, WaypointData} from "@front/viewer/registry";
import {positionShip, resetShipWaypoints} from "@front/viewer/positionShips";
import {getDistance} from "@common/lib/getDistance";
import {getStarPosition} from "@front/viewer/util";
import {UniverseEntity} from "@front/viewer/universe-entity";
import {UniverseShip} from "@front/viewer/universe-ship";
import {store} from "@front/ui/store";
import {selectionActions} from "@front/ui/slices/selection";
import {shipActions} from "@front/ui/slices/ship";
import {systemToDisplayCoordinates} from "@front/viewer/worldCoordinateToOriginal";
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

    let texture = loadedAssets.spritesheet.textures[`public/textures/stars/${starData.type}.png`]

    const star = new UniverseEntity({
        texture: texture ?? loadedAssets.spritesheet.textures['public/textures/stars/large_white.png'],
        traits: getTraits(starData),
        label: starData.name+'\n('+starData.symbol+')',
        color: starData.hasJumpGate ? 0x00FF00 : 0xFFFFFF,
        position: getStarPosition(starData),
        onSelect: () => {
            Registry.deselect()
            Registry.selected = {
                type: 'star',
                symbol: starData.symbol,
            }
            store.dispatch(selectionActions.setSelection({
                type: 'star',
                symbol: starData.symbol,
            }))
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
    const shipGroup = new UniverseShip({
        label: ship.callsign,
        texture: loadedAssets.spritesheet.textures['public/textures/ships/'+ship.frameSymbol+'.png'] ? loadedAssets.spritesheet.textures['public/textures/ships/'+ship.frameSymbol+'.png'] : loadedAssets.spritesheet.textures['public/textures/ships/FRAME_EXPLORER.png'],
        traits: [],
        position: {x: 0, y:0},
        scale: 0.75,
        onSelect: () => {
            Registry.deselect()
            Registry.selected = {
                type: 'ship',
                symbol: ship.symbol,
            }
            store.dispatch(selectionActions.setSelection({
                type: 'ship',
                symbol: ship.symbol,
            }))
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

let universeJumpGraphics: Graphics

export function hideUnverseJumpGraphics() {
    if (!universeJumpGraphics) {
        return;
    }
    universeJumpGraphics.visible = false
}

export function showUnverseJumpGraphics() {
    if (!universeJumpGraphics) {
        return;
    }
    universeJumpGraphics.visible = true
}

export function renderUniverseJumpGraphics() {
    if (!universeJumpGraphics) {
        return;
    }
    console.log("rendering universe jump graphics", Object.keys(Registry.universeJumpData))
    universeJumpGraphics.clear()
    for(const systemSymbol of Object.keys(Registry.universeJumpData)) {
        const system = Registry.systemData[systemSymbol]
        if (system) {
            const jumpData = Registry.universeJumpData[systemSymbol]
            console.log("target systems", jumpData)
            const fromPos = getStarPosition({
                x: system.x,
                y: system.y
            })

            for(const targetSymbol of jumpData) {
                universeJumpGraphics.moveTo(fromPos.x, fromPos.y)
                const target = Registry.systemData[targetSymbol]

                if (target) {

                    const toPos = getStarPosition({
                        x: target.x,
                        y: target.y
                    })
                    console.log("Draw graphics from ", fromPos, " to ", toPos)
                    universeJumpGraphics.stroke({
                        width: 1000,
                        color: 0x0000FF,
                    }).lineTo(toPos.x, toPos.y)

                }
            }
        }
    }

}

export const loadUniverse = async () => {
    const systems = await trpc.getSystems.query()

    const commandShip = Object.values(Registry.shipData).find(ship => ship.role === 'COMMAND')
    const commandShipLocation = commandShip?.currentWaypoint.systemSymbol

    for(const starData of systems) {
        Registry.systemData[starData.symbol] = starData

        if (starData.x < universeCoordinates.minX) universeCoordinates.minX = starData.x
        if (starData.x > universeCoordinates.maxX) universeCoordinates.maxX = starData.x
        if (starData.y < universeCoordinates.minY) universeCoordinates.minY = starData.y
        if (starData.y > universeCoordinates.maxY) universeCoordinates.maxY = starData.y
    }

    Registry.systems = {}

    for(const starData of systems) {
        if (!commandShip || getDistance(Registry.systemData[commandShip.currentSystemSymbol], starData) < 1000) {
            const starContainer = createStar(starData)

            Registry.systems[starData.symbol] = starContainer
        }
    }

    Registry.universeShips = {}
    Object.values(Registry.shipData).forEach(ship => {
        const shipContainer = createShip(ship)
        Registry.universeShips[ship.symbol] = shipContainer
        //starsContainer.addChild(shipContainer)
    })
    // universeCuller.addList(starsCont.children)

    universeJumpGraphics = new Graphics();
    universeJumpGraphics.alpha = 0.5
    universeJumpGraphics.visible = true
    universeJumpGraphics.eventMode = 'none'
    overlayLayer.addChild(universeJumpGraphics)

    resetShipWaypoints()

    if (commandShipLocation) {
        universeView.moveCenter(Registry.systems[commandShipLocation].x, Registry.systems[commandShipLocation].y)
    }
}

export const showStar = (symbol: string) => {
    if (Registry.systems[symbol]) {
      return;
    }
    console.log("Showing star", symbol)
    const starData = Registry.systemData[symbol]
    if (starData) {
      const starContainer = createStar(starData)

      Registry.systems[starData.symbol] = starContainer
    }
}

export const hideStar = (symbol: string) => {
    const star = Registry.systems[symbol]
    if (star) {
        star.unload()
    }
    delete Registry.systems[symbol]
}
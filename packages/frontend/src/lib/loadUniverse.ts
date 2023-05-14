import {BitmapText, Container, DisplayObject, Graphics, Sprite} from "pixi.js";
import { trpc } from '@app/lib/trpc'
import { makeInteractiveAndSelectable } from "@app/lib/makeInteractiveAndSelectable";
import {loadedAssets} from "@app/lib/assets";
import {systemCoordinates, systemScale, totalSize, universeCoordinates} from "@app/lib/consts";
import {backButton, systemView, uiOverlay, universeView} from "@app/lib/UIElements";
import {GameState, WaypointData} from "@app/lib/game-state";
import {positionShip, resetShipWaypoints} from "@app/lib/positionShips";
import {loadSystem} from "@app/lib/loadSystem";

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

        makeInteractiveAndSelectable(starContainer, {
            onOrder: [
                {
                    name: 'Warp',
                    withSelection: 'ship',
                    action: async () => {
                        if (GameState.selected?.symbol) {

                            const system = await trpc.dataForDisplay.query({
                                system: starData.symbol
                            });
                            const bestWaypoint = system.waypoints.find(w => w.traits.find(t => t.symbol === 'MARKETPLACE')).symbol ?? system.waypoints[0].symbol
                            if (bestWaypoint) {
                                console.log("warping to first waypoint in", system)
                                const res = await trpc.instructWarp.mutate({
                                    shipSymbol: GameState.selected.symbol,
                                    waypointSymbol: bestWaypoint
                                })

                                GameState.visibleShips[res.symbol].shipData = res
                            } else {
                                alert("Cannot warp to system without waypoints, nothing to target")
                            }
                        }
                    }
                }
            ]
        })

        starContainer.on('click', () => {
            loadSystem(starData.symbol)
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


    universeView.addChild(graphics)

    // universeView.moveCenter(references['X1-VU95'].x, references['X1-VU95'].y)

    return {
        systems: references
    }
}
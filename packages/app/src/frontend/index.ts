import {loadAssets, loadedAssets} from "@front/lib/assets";
import {loadUniverse} from "@front/lib/loadUniverse";
import {systemCoordinateToOriginal, worldCoordinateToOriginal} from "@front/lib/worldCoordinateToOriginal";
//     👆 **type-only** import
import {gameHeight, scale, systemCoordinates, totalSize} from '@front/lib/consts'
import {
    createUIElements,
    currentCoordinate, fps, marketWindow,
    systemView, universeCuller, universeGraphics, universeGraphicsText,
    universeView
} from "@front/lib/UIElements";
import {GameState} from "@front/lib/game-state";
import {deselectListeners} from "@front/lib/makeInteractiveAndSelectable";
import {positionShip, positionUniverseShip, positionWaypoint, resetShipWaypoints} from "@front/lib/positionShips";
import {availableActions} from "@front/lib/availableActions";
import {loadPlayerData} from "@front/lib/loadPlayerData";
import {clearGraphics, systemTargetingLine, universeTargetingLine} from "@front/lib/targetingLine";
import {loadSystem} from "@front/lib/loadSystem";
import {trpc} from "@front/lib/trpc";
import { app  } from './lib/application'
import {convertToDisplayCoordinates} from "@front/lib/util";
import {Graphics} from "pixi.js";
import {credits, cruiseModeSelect, entityInfo} from "@front/lib/createSidebar";

if (!localStorage.getItem('agent-token')) {
    const agentToken = prompt('Please enter your agent token')
    localStorage.setItem('agent-token', agentToken)
}

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container


// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);
app.view.addEventListener('contextmenu', (e) => {
    e.preventDefault()
})

app.stage.interactive = true;
app.stage.hitArea = app.screen;

app.stage.on("click", (event) => {
    console.log(event)

    deselectListeners.emit('deselect')
    GameState.selected = undefined
})

await loadAssets()
await createUIElements(app)
await loadPlayerData()

const loadedUniverse = await loadUniverse()

const format = Intl.NumberFormat('en');
// Listen for frame updates
let lastRefresh = Date.now()
let hidingLabels = false;

let currentRoute

app.ticker.add((dt) => {
    const sizeMultiplier = Math.min(universeView.worldScreenWidth / universeView.screenWidth, 20)
    const shipSizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth



    credits.displayObject.bitmapText.text = `${format.format(GameState.agent.credits)}`

    if (Date.now() - lastRefresh > 5000) {
        lastRefresh = Date.now()
        loadPlayerData()
    }


    if (GameState.currentView == 'universe') {
        Object.values(loadedUniverse.systems).forEach(ref => {
            ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
        })
        if (!hidingLabels && shipSizeMultiplier > 15) {
            hidingLabels = true
            Object.values(loadedUniverse.systems).forEach(ref => {
                ref.getChildByName('label').visible = false
                ref.interactive = false;
            })
        } else if (hidingLabels && shipSizeMultiplier < 15) {
            hidingLabels = false
            Object.values(loadedUniverse.systems).forEach(ref => {
                ref.getChildByName('label').visible = true
                ref.interactive = true
            })
        }

        const worldCoordinates = worldCoordinateToOriginal(universeView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset))
        currentCoordinate.text = worldCoordinates.x + ', ' + worldCoordinates.y

        resetShipWaypoints()
        Object.keys(GameState.universeShips).forEach(shipKey => {
            const shipData = GameState.shipData[shipKey]
            const shipContainer = GameState.universeShips[shipKey]

            shipContainer.scale = {x: shipSizeMultiplier, y: shipSizeMultiplier}
            const shipPosition = positionUniverseShip(shipData)
            shipContainer.x = shipPosition.x
            shipContainer.y = shipPosition.y
            const nav = shipContainer.getChildByName('nav')
            if (nav) {
                if (shipPosition.navRot) {
                    nav.visible = true
                    shipContainer.getChildByName('ship').rotation = shipPosition.navRot
                    shipContainer.getChildByName('nav').rotation = shipPosition.navRot
                } else {
                    nav.visible = false
                    shipContainer.getChildByName('ship').rotation = 0
                    shipContainer.getChildByName('nav').rotation = 0
                }
            }
            if (shipData.navStatus === 'IN_TRANSIT' && new Date(shipData.arrivalOn).getTime() < Date.now()) {
                shipData.navStatus = 'IN_ORBIT'
            }
        })
    } else {
        const systemCoordinate = systemCoordinateToOriginal(systemView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset))
        currentCoordinate.text = systemCoordinate.x + ', ' + systemCoordinate.y

        Object.keys(GameState.waypoints).forEach(waypointSymbol => {
            const waypointItem = GameState.waypoints[waypointSymbol]
            const waypointData = GameState.waypointData[waypointSymbol]

            const newPosition = positionWaypoint(waypointData, Date.now(), )
            waypointItem.x = newPosition.x
            waypointItem.y = newPosition.y
        })

        resetShipWaypoints()
        Object.keys(GameState.systemShips).forEach(shipKey => {
            const shipData = GameState.shipData[shipKey]
            const shipContainer = GameState.systemShips[shipKey]

            const shipPosition = positionShip(shipData)
            shipContainer.x = shipPosition.x
            shipContainer.y = shipPosition.y
            const nav = shipContainer.getChildByName('nav')
            if (nav) {
                if (shipPosition.navRot) {
                    nav.visible = true
                    shipContainer.getChildByName('ship').rotation = shipPosition.navRot
                    shipContainer.getChildByName('nav').rotation = shipPosition.navRot
                } else {
                    nav.visible = false
                    shipContainer.getChildByName('ship').rotation = 0
                    shipContainer.getChildByName('nav').rotation = 0
                }
            }
            if (shipData.navStatus === 'IN_TRANSIT' && new Date(shipData.arrivalOn).getTime() < Date.now()) {
                shipData.navStatus = 'IN_ORBIT'
            }
        })
    }

    clearGraphics()
    universeTargetingLine(sizeMultiplier)
    systemTargetingLine()

    const homeGraphics: Graphics =  universeView.getChildByName('homeSystem')
    if (GameState.selected) {
        if (GameState.selected.type === 'ship') {
            const shipInfo = GameState.shipData[GameState.selected.symbol]

            cruiseModeSelect.displayObject.visible = true
            if (shipInfo.flightMode && cruiseModeSelect.selectedValue !== shipInfo.flightMode) {
                cruiseModeSelect.setSelectedValue(shipInfo.flightMode)
            }

            const cooldownTime = new Date(shipInfo.reactorCooldownOn).getTime()
            const cooldownValue = cooldownTime > Date.now() ? (Math.round((cooldownTime - Date.now())/1000)+'s') : 'Ready'
            const navTime = new Date(shipInfo.arrivalOn).getTime();
            const arrivalValue = navTime > Date.now() ? (Math.round((navTime - Date.now())/1000)+'s') : 'Ready'
            if (GameState.agent.symbol === shipInfo.agent) {
                // your own ships
                entityInfo.displayObject.bitmapText.text = `Entity Information\nSymbol: ${shipInfo.symbol}\nLocation: ${shipInfo.currentWaypoint.symbol}\nFuel: ${shipInfo.fuelAvailable}/${shipInfo.fuelCapacity}\nCargo: ${shipInfo.cargoUsed}/${shipInfo.cargoCapacity}\nNav Status: ${shipInfo.navStatus} ${arrivalValue}\nReactor Cooldown: ${cooldownValue}\nAction: ${shipInfo.overalGoal}`
            } else {
                // someone elses ships
                entityInfo.displayObject.bitmapText.text = `Entity Information\nSymbol: ${shipInfo.symbol}\nLocation: ${shipInfo.currentWaypoint.symbol}\nOwner: ${shipInfo.agent}\nNav Status: ${shipInfo.navStatus} ${arrivalValue}\nLast update: ${Math.round((Date.now() - new Date(shipInfo.updatedAt).getTime())/1000)}s ago`
            }

            if (GameState.hoveredSystem) {
                if (currentRoute != GameState.hoveredSystem + GameState.selected.symbol) {
                    currentRoute = GameState.hoveredSystem + GameState.selected.symbol
                    const route = trpc.getRoute.query({
                        fromSystemSymbol: shipInfo.currentSystemSymbol,
                        toSystemSymbol: GameState.hoveredSystem.symbol
                    }).then(data => {
                        const graphics: Graphics = universeView.getChildByName('route')
                        graphics.clear()
                        data.finalPath.forEach(item => {
                            const fromSystem = GameState.systemData[item.source]
                            const toSystem = GameState.systemData[item.target]
                            const displayCoords = convertToDisplayCoordinates(fromSystem)
                            const targetCoords = convertToDisplayCoordinates(toSystem)

                            graphics.lineStyle({
                                width: 10,
                                color: 0x00FF00,
                                alpha: 0.25,
                            })
                            graphics.moveTo(displayCoords.x, displayCoords.y)
                            graphics.lineTo(targetCoords.x, targetCoords.y)
                            graphics.closePath()
                        })
                    })
                }
            } else {
                currentRoute = ''
                const graphics: Graphics = universeView.getChildByName('route')
                graphics.clear()
            }


            if (GameState.currentView == 'universe' && shipInfo.currentBehavior) {
                homeGraphics.clear()
                const homeSystem = GameState.systemData[shipInfo.homeSystemSymbol]

                const shipCoordinates = GameState.universeShips[shipInfo.symbol].position
                const displayCoordinates = convertToDisplayCoordinates(homeSystem)

                homeGraphics.lineStyle({
                    width: 10 * sizeMultiplier,
                    color: 0x00FF00,
                    alpha: 0.5,
                })
                homeGraphics.moveTo(shipCoordinates.x, shipCoordinates.y)
                homeGraphics.lineTo(displayCoordinates.x, displayCoordinates.y)
                homeGraphics.closePath()

                homeGraphics.lineStyle({
                    width: 10 * sizeMultiplier,
                    color: 0xFFFFFF,
                    alpha: 0.5,
                })
                const range = shipInfo.behaviorRange * scale.universe
                homeGraphics.drawRect(displayCoordinates.x - range, displayCoordinates.y - range, range*2, range*2)
                homeGraphics.closePath()
            } else {
                homeGraphics.clear()
            }
        } else if (GameState.selected.type === 'waypoint') {
            const waypointInfo = GameState.waypointData[GameState.selected.symbol]
            entityInfo.displayObject.bitmapText.text = `Entity Information\nSymbol: ${GameState.selected.symbol}\nKind: ${waypointInfo.type}\nTraits: ${waypointInfo.traits.length == 0 ? 'UNKNOWN' : waypointInfo.traits.map(t => t.name).join(', ')}\nFaction: ${waypointInfo.factionSymbol}\nChart: ${waypointInfo.chartSubmittedBy ? `${waypointInfo.chartSubmittedBy} at ${waypointInfo.chartSubmittedOn}` : 'None'}`

            if (waypointInfo.traits.find(t => t.symbol === 'MARKETPLACE') && GameState.displayedMarket !== GameState.selected.symbol) {
                GameState.displayedMarket = GameState.selected.symbol
                trpc.getMarketInfo.query({
                    waypoint: GameState.selected.symbol
                }).then(data => {
                    console.log('marketinfo', data)
                    marketWindow.clearGoods()
                    marketWindow.setGoods(data)
                    marketWindow.container.displayObject.x = 400
                    marketWindow.container.displayObject.y = gameHeight - 200
                    marketWindow.container.displayObject.visible = true
                })
            }
        }
    } else {
        currentRoute = ''
        const graphics: Graphics = universeView.getChildByName('route')
        graphics.clear()
        homeGraphics.clear()

        GameState.displayedMarket = undefined
        marketWindow.container.displayObject.visible = false
        cruiseModeSelect.displayObject.visible = false
        entityInfo.displayObject.bitmapText.text = `Entity Information`
    }

    if (universeView.dirty) {
        universeCuller.cull(universeView.getVisibleBounds())
        universeView.dirty = false
    }

    fps.text = `FPS: ${Math.round(app.ticker.FPS)}`
});
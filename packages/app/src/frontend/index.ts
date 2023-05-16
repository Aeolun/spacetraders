import {Application, BitmapText, Container, TilingSprite} from 'pixi.js';
import {Viewport} from 'pixi-viewport'

import {loadAssets, loadedAssets} from "@front/lib/assets";
import {loadUniverse} from "@front/lib/loadUniverse";
import {systemCoordinateToOriginal, worldCoordinateToOriginal} from "@front/lib/worldCoordinateToOriginal";
//     👆 **type-only** import
import {systemCoordinates, totalSize} from '@front/lib/consts'
import {
    actionButton,
    createUIElements, cruiseModeSelect,
    currentCoordinate,
    currentSelected, entityInfo, fps,
    systemView, universeCuller, universeGraphics, universeGraphicsText,
    universeView
} from "@front/lib/UIElements";
import {GameState} from "@front/lib/game-state";
import {deselectListeners} from "@front/lib/makeInteractiveAndSelectable";
import {positionShip, positionUniverseShip, resetShipWaypoints} from "@front/lib/positionShips";
import {availableActions} from "@front/lib/availableActions";
import {loadPlayerData} from "@front/lib/loadPlayerData";
import {clearGraphics, systemTargetingLine, universeTargetingLine} from "@front/lib/targetingLine";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application({
    resizeTo: window
});

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

// Listen for frame updates
app.ticker.add(() => {
    const sizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth

    if (GameState.currentView == 'universe') {
        Object.values(loadedUniverse.systems).forEach(ref => {
            ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
        })

        const worldCoordinates = worldCoordinateToOriginal(universeView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset))
        currentCoordinate.text = worldCoordinates.x + ', ' + worldCoordinates.y

        resetShipWaypoints()
        Object.keys(GameState.universeShips).forEach(shipKey => {
            const shipData = GameState.shipData[shipKey]
            const shipContainer = GameState.universeShips[shipKey]

            shipContainer.scale = {x: sizeMultiplier, y: sizeMultiplier}
            const shipPosition = positionUniverseShip(shipData)
            shipContainer.x = shipPosition.x
            shipContainer.y = shipPosition.y
            const nav = shipContainer.getChildByName('nav')
            if (nav) {
                if (shipPosition.navRot) {
                    nav.visible = true
                    shipContainer.rotation = shipPosition.navRot
                } else {
                    nav.visible = false
                    shipContainer.rotation = 0
                }
            }
            if (shipData.navStatus === 'IN_TRANSIT' && new Date(shipData.arrivalOn).getTime() < Date.now()) {
                shipData.navStatus = 'IN_ORBIT'
            }
        })
    } else {
        const systemCoordinate = systemCoordinateToOriginal(systemView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset))
        currentCoordinate.text = systemCoordinate.x + ', ' + systemCoordinate.y

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
                    shipContainer.rotation = shipPosition.navRot
                } else {
                    nav.visible = false
                    shipContainer.rotation = 0
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

    availableActions.forEach(action => {
        const isAvailable = action.isAvailable()

        actionButton[action.name].disabled = !isAvailable
    })

    if (GameState.selected) {
        currentSelected.text = `Selected: ${GameState.selected.symbol} - ${GameState.selected.type}`
        if (GameState.selected.type === 'ship') {
            const shipInfo = GameState.shipData[GameState.selected.symbol]

            cruiseModeSelect.visible = true
            if (shipInfo.flightMode && cruiseModeSelect.selectedValue !== shipInfo.flightMode) {
                cruiseModeSelect.setSelectedValue(shipInfo.flightMode)
            }

            const cooldownTime = new Date(shipInfo.reactorCooldownOn).getTime()
            const cooldownValue = cooldownTime > Date.now() ? (Math.round((cooldownTime - Date.now())/1000)+'s') : 'Ready'
            const navTime = new Date(shipInfo.arrivalOn).getTime();
            const arrivalValue = navTime > Date.now() ? (Math.round((navTime - Date.now())/1000)+'s') : 'Ready'
            entityInfo.text = `Entity Information\nSymbol: ${shipInfo.symbol}\nLocation: ${shipInfo.currentWaypoint.symbol}\nFuel: ${shipInfo.fuelAvailable}/${shipInfo.fuelCapacity}\nCargo: ${shipInfo.cargoUsed}/${shipInfo.cargoCapacity}\nNav Status: ${shipInfo.navStatus} ${arrivalValue}\nReactor Cooldown: ${cooldownValue}`
        } else if (GameState.selected.type === 'waypoint') {
            const waypointInfo = GameState.visibleWaypoints[GameState.selected.symbol].waypointData
            entityInfo.text = `Entity Information\nSymbol: ${GameState.selected.symbol}\nKind: ${waypointInfo.type}\nTraits: ${waypointInfo.traits.length == 0 ? 'UNKNOWN' : waypointInfo.traits.map(t => t.name).join(', ')}\nFaction: ${waypointInfo.factionSymbol}\nChart: ${waypointInfo.chartSubmittedBy ? `${waypointInfo.chartSubmittedBy} at ${waypointInfo.chartSubmittedOn}` : 'None'}`
        }
    } else {
        cruiseModeSelect.visible = false
        currentSelected.text = `Selected:`
        entityInfo.text = `Entity Information`
    }

    if (universeView.dirty) {
        universeCuller.cull(universeView.getVisibleBounds())
        universeView.dirty = false
    }

    fps.text = `FPS: ${Math.round(app.ticker.FPS)}`
});
import {Application, BitmapText, Container, TilingSprite} from 'pixi.js';
import {Viewport} from 'pixi-viewport'

import {loadAssets, loadedAssets} from "@app/lib/assets";
import {loadUniverse} from "@app/lib/loadUniverse";
import {systemCoordinateToOriginal, worldCoordinateToOriginal} from "@app/lib/worldCoordinateToOriginal";
//     👆 **type-only** import
import {systemCoordinates, totalSize} from '@app/lib/consts'
import {
    actionButton,
    createUIElements,
    currentCoordinate,
    currentSelected, entityInfo, fps,
    systemView, universeCuller, universeGraphics, universeGraphicsText,
    universeView
} from "@app/lib/UIElements";
import {GameState} from "@app/lib/game-state";
import {deselectListeners} from "@app/lib/makeInteractiveAndSelectable";
import {positionShip, resetShipWaypoints} from "@app/lib/positionShips";
import {availableActions} from "@app/lib/availableActions";
import {loadPlayerData} from "@app/lib/loadPlayerData";
import {clearGraphics, systemTargetingLine, universeTargetingLine} from "@app/lib/targetingLine";

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
        const worldCoordinates = worldCoordinateToOriginal(universeView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset))
        currentCoordinate.text = worldCoordinates.x + ', ' + worldCoordinates.y
    } else {
        const systemCoordinate = systemCoordinateToOriginal(systemView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset))
        currentCoordinate.text = systemCoordinate.x + ', ' + systemCoordinate.y

        resetShipWaypoints()
        Object.values(GameState.visibleShips).forEach(shipState => {
            const shipPosition = positionShip(shipState.shipData)
            shipState.container.x = shipPosition.x
            shipState.container.y = shipPosition.y
            const nav = shipState.container.getChildByName('nav')
            if (nav) {
                if (shipPosition.navRot) {
                    nav.visible = true
                    shipState.container.rotation = shipPosition.navRot
                } else {
                    nav.visible = false
                    shipState.container.rotation = 0
                }
            }
            if (shipState.shipData.navStatus === 'IN_TRANSIT' && new Date(shipState.shipData.arrivalOn).getTime() < Date.now()) {
                shipState.shipData.navStatus = 'IN_ORBIT'
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


    Object.values(loadedUniverse.systems).forEach(ref => {
        ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
    })

    if (GameState.selected) {
        currentSelected.text = `Selected: ${GameState.selected.symbol} - ${GameState.selected.type}`
        if (GameState.selected.type === 'ship') {
            const shipInfo = GameState.visibleShips[GameState.selected.symbol].shipData
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
        currentSelected.text = `Selected:`
        entityInfo.text = `Entity Information`
    }

    if (universeView.dirty) {
        universeCuller.cull(universeView.getVisibleBounds())
        universeView.dirty = false
    }

    fps.text = `FPS: ${Math.round(app.ticker.FPS)}`
});
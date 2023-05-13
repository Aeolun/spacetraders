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
    currentSelected, entityInfo,
    systemView,
    universeView
} from "@app/lib/UIElements";
import {GameState} from "@app/lib/game-state";
import {deselectListeners} from "@app/lib/makeInteractiveAndSelectable";
import {positionShip, resetShipWaypoints} from "@app/lib/positionShips";
import {availableActions} from "@app/lib/availableActions";

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

const loadedUniverse = await loadUniverse()

// Listen for frame updates
app.ticker.add(() => {
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

    availableActions.forEach(action => {
        const isAvailable = action.isAvailable()

        actionButton[action.name].disabled = !isAvailable
    })

    const sizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth
    Object.values(loadedUniverse.systems).forEach(ref => {
        ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
    })

    if (GameState.selected) {
        currentSelected.text = `Selected: ${GameState.selected.symbol} - ${GameState.selected.type}`
        if (GameState.selected.type === 'ship') {
            const shipInfo = GameState.visibleShips[GameState.selected.symbol].shipData
            const cooldownTime = new Date(shipInfo.reactorCooldownOn).getTime()
            entityInfo.text = `Entity Information\nSymbol: ${shipInfo.symbol}\nLocation: ${shipInfo.currentWaypoint.symbol}\nFuel: ${shipInfo.fuelAvailable}/${shipInfo.fuelCapacity}\nCargo: ${shipInfo.cargoUsed}/${shipInfo.cargoCapacity}\nNav Status: ${shipInfo.navStatus}\nReactor Cooldown: ${cooldownTime > Date.now() ? (Math.round((cooldownTime - Date.now())/1000)+'s') : 'Ready'}`
        } else if (GameState.selected.type === 'waypoint') {
            const waypointInfo = GameState.visibleWaypoints[GameState.selected.symbol].waypointData
            entityInfo.text = `Entity Information\nSymbol: ${GameState.selected.symbol}\nKind: ${waypointInfo.type}\nTraits: ${waypointInfo.traits.length == 0 ? 'UNKNOWN' : waypointInfo.traits.map(t => t.name).join(', ')}`
        }
    } else {
        currentSelected.text = `Selected:`
        entityInfo.text = `Entity Information`
    }
});
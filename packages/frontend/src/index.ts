import {Application, BitmapText, Container, TilingSprite} from 'pixi.js';
import {Viewport} from 'pixi-viewport'

import {loadAssets, loadedAssets} from "@app/lib/assets";
import {loadUniverse} from "@app/lib/loadUniverse";
import {systemCoordinateToOriginal, worldCoordinateToOriginal} from "@app/lib/worldCoordinateToOriginal";
//     👆 **type-only** import
import {systemCoordinates, totalSize} from '@app/lib/consts'
import {createUIElements, currentCoordinate, currentSelected, systemView, universeView} from "@app/lib/UIElements";
import {GameState} from "@app/lib/game-state";
import {deselectListeners} from "@app/lib/makeInteractiveAndSelectable";
import {positionShip, resetShipWaypoints} from "@app/lib/positionShips";

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
        GameState.visibleShips.forEach(shipState => {
            const shipPosition = positionShip(shipState.shipData)
            shipState.container.x = shipPosition.x
            shipState.container.y = shipPosition.y
            const nav = shipState.container.getChildByName('nav')
            if (shipPosition.navRot) {
                nav.visible = true
                nav.rotation = shipPosition.navRot
            } else {
                nav.visible = false
            }
        })
    }

    const sizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth
    Object.values(loadedUniverse.systems).forEach(ref => {
        ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
    })

    if (GameState.selected) {
        currentSelected.text = `Selected: ${GameState.selected.symbol} - ${GameState.selected.type}`
    } else {
        currentSelected.text = `Selected:`
    }
});
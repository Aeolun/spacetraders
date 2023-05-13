import {Viewport} from "pixi-viewport";
import {totalSize} from "@app/lib/consts";
import {Application, BitmapText, Container, NineSlicePlane, TilingSprite} from "pixi.js";
import {loadedAssets} from "@app/lib/assets";
import {Button} from "@app/lib/button";
import {GameState} from "@app/lib/game-state";
import {trpc} from "@app/lib/trpc";

export let universeView: Viewport
export let systemView: Viewport
export let uiOverlay: Container
export let currentCoordinate: BitmapText
export let currentSelected: BitmapText
export let backButton: Button

export const createUIElements = (app: Application) => {
    systemView = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 2000,
        worldHeight: 2000,
        events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })
    systemView
        .drag()
        .pinch()
        .wheel()
        .decelerate()
    systemView.visible = false
    systemView.moveCenter(1000, 1000)

    universeView = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: totalSize,
        worldHeight: totalSize,

        events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })
    universeView
        .drag()
        .pinch()
        .wheel()
        .decelerate()
    universeView.moveCenter(totalSize/2, totalSize/2)

    uiOverlay = new Container()
    const panelBg = new NineSlicePlane(loadedAssets.uisheet.textures['uisheet/tile/frame.png'], 15, 15, 15, 15);
    panelBg.x = 0
    panelBg.y = 0
    panelBg.width=400
    panelBg.height = window.innerHeight

    backButton = new Button('Back', {
        height: 64,
        width: 368
    })
    backButton.on('click', () => {
        universeView.visible = true
        systemView.visible = false
        GameState.currentView = 'universe'
        systemView.removeChildren()
        backButton.visible = false
    })
    backButton.y = 16;
    backButton.x = 16
    backButton.visible = false
    panelBg.addChild(backButton)

    backButton = new Button('Refuel', {
        height: 64,
        width: 368
    })
    backButton.on('click', async () => {
        const refuel = await trpc.instructRefuel.mutate()
    })
    backButton.y = 16;
    backButton.x = 16
    backButton.visible = false
    panelBg.addChild(backButton)


    uiOverlay.addChild(panelBg);

    currentCoordinate = new BitmapText('0, 0', {
        fontName: 'sans-serif',
        fontSize: 18,
        align: 'right',
    })
    currentCoordinate.x = 16
    currentCoordinate.y = 80
    uiOverlay.addChild(currentCoordinate)

    currentSelected = new BitmapText('Selected: ', {
        fontName: 'sans-serif',
        fontSize: 18,
        align: 'right',
    })
    currentSelected.x = 16
    currentSelected.y = 104
    uiOverlay.addChild(currentSelected)

    const bgContainer = new TilingSprite(loadedAssets.bgTexture, 4096, 4096);

    app.stage.addChild(bgContainer)
    app.stage.addChild(universeView);
    app.stage.addChild(systemView);
    app.stage.addChild(uiOverlay);
}
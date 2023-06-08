import {Viewport} from "pixi-viewport";
import {totalSize} from "@front/lib/consts";
import {Application, BitmapText, Container, Graphics, NineSlicePlane, Point, Sprite, TilingSprite} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";
import {GameState} from "@front/lib/game-state";
import {trpc} from "@front/lib/trpc";
import {availableActions} from "@front/lib/availableActions";
import { Simple, SpatialHash } from "pixi-cull"
import {Switch} from "@front/lib/switch";
import {MarketWindow} from "@front/lib/MarketWindow";
import {createActionButtons} from "@front/lib/ui/action-buttons";
import {BaseButton} from "@front/lib/base-elements/base-button";

export let universeView: Viewport
export let systemView: Viewport
export let uiOverlay: Container
export let currentCoordinate: BitmapText
export let fps: BitmapText
export let credits: BitmapText
export let backButton: BaseButton
export let entityInfo: BitmapText
export let universeCuller: Simple
export let universeGraphics: Graphics
export let universeGraphicsText: BitmapText

export let systemGraphics: Graphics
export let systemGraphicsText: BitmapText
export let cruiseModeSelect: Switch

export let marketWindow: MarketWindow

export const createUIElements = (app: Application) => {
    let pointerDownPlace: Point | undefined;
    systemView = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 2000,
        worldHeight: 2000,
        events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })
    systemView.on('pointerdown', (event) => {
        console.log('pointerdown')
        pointerDownPlace = new Point(event.globalX, event.globalY)
    })
    systemView.on('click', (event) => {
        console.log('click')
        if (pointerDownPlace) {
            const distance = Math.abs(pointerDownPlace.x - event.globalX) + Math.abs(pointerDownPlace.y - event.globalY)
            if (distance > 2) {
                console.log("cancelling drag event")
                event.stopPropagation();
            }
        }
    })
    systemGraphics = new Graphics()
    systemView.addChild(systemGraphics)

    systemGraphicsText = new BitmapText("", {
        fontName: 'sans-serif',
        fontSize: 16,
        //tint: 0x0000FF,
        align: 'right',
    })
    systemView.addChild(systemGraphicsText)

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
    universeView.on('pointerdown', (event) => {
        console.log('pointerdown')
        pointerDownPlace = new Point(event.globalX, event.globalY)
    })
    universeView.on('click', (event) => {
        console.log('click')
        if (pointerDownPlace) {
            const distance = Math.abs(pointerDownPlace.x - event.globalX) + Math.abs(pointerDownPlace.y - event.globalY)
            if (distance > 2) {
                console.log("cancelling drag event")
                event.stopPropagation();
            }
        }
    })
    universeView
        .drag()
        .pinch()
        .wheel()
        .decelerate()
    universeView.moveCenter(totalSize/2, totalSize/2)
    universeCuller = new Simple() // new SpatialHash()
    universeCuller.addList(universeView.children)
    universeCuller.cull(universeView.getVisibleBounds())
    universeGraphics = new Graphics()
    universeView.addChild(universeGraphics)

    universeGraphicsText = new BitmapText("", {
        fontName: 'sans-serif',
        fontSize: 16,
        //tint: 0x0000FF,
        align: 'right',
    })
    universeView.addChild(universeGraphicsText)


    uiOverlay = new Container()

    const panelBack = new TilingSprite(loadedAssets.panelBg, 208, 208)
    panelBack.height=window.innerHeight - 16
    panelBack.x = 8
    panelBack.width = 386
    panelBack.y = 8
    uiOverlay.addChild(panelBack)

    const panelBg = new NineSlicePlane(loadedAssets.panel, 19, 19, 19, 19);
    panelBg.x = 0
    panelBg.y = 0
    panelBg.width=400
    panelBg.height = window.innerHeight



    backButton = new BaseButton('Back', {
        height: 64,
        width: 368
    })
    backButton.on('click', (event) => {
        event.stopPropagation();
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


    const creditsBackground = new NineSlicePlane(loadedAssets.statsBlock, 10, 10, 10, 10)
    creditsBackground.x = 8
    creditsBackground.width = 384
    creditsBackground.height = 80
    creditsBackground.y = 100
    panelBg.addChild(creditsBackground)
    const creditsLabel = new BitmapText('Credits', {
        fontName: 'buttontext_white',
        tint: 0x00FF00,
        fontSize: 16
    })
    creditsLabel.x = 16
    creditsLabel.y = 120
    panelBg.addChild(creditsLabel)
    credits = new BitmapText('0', {
        fontName: 'segment',
        fontSize: 36,
        align: 'left',
        tint: 0x00FF00
    })
    credits.x = 16
    credits.y = 132
    panelBg.addChild(credits)



    const cruiseModeButtons = ['CRUISE', 'DRIFT', 'BURN', 'STEALTH']
    cruiseModeSelect = new Switch(cruiseModeButtons, {
        width: 368,
        textSize: 14,
        defaultSelected: 'CRUISE',
    }, async (event, selectedOption) => {
        if (GameState.selected?.type === 'ship') {
            const newShip = await trpc.instructPatchNavigate.mutate({
                shipSymbol: GameState.selected?.symbol,
                navMode: selectedOption
            })
            console.log('new state', newShip)
            GameState.shipData[GameState.selected.symbol] = newShip
        }
    })
    cruiseModeSelect.visible = true
    cruiseModeSelect.y = 700 - 64
    cruiseModeSelect.x = 16
    panelBg.addChild(cruiseModeSelect)

    // cruiseModeButtons.forEach((button, index) => {
    //     const but = new Button(button, {
    //         textSize: 16,
    //         height: 48,
    //         width: 368/4
    //     }, async () => {
    //
    //     })
    //     but.y = actionPanelY - 64
    //     but.x = 16 + (368/4 * index)
    //     panelBg.addChild(but)
    //     cruiseModeButtons[button] = but
    // })

    marketWindow = new MarketWindow()
    marketWindow.container.displayObject.visible = false

    uiOverlay.addChild(marketWindow.container.displayObject)

    uiOverlay.addChild(panelBg);

    const actionButtons = createActionButtons()
    actionButtons.y = 800
    panelBg.addChild(actionButtons)

    const statsBlock = new NineSlicePlane(loadedAssets.statsBlock, 10, 10, 10, 10)
    statsBlock.x = 8
    statsBlock.width = 384
    statsBlock.height = 200
    statsBlock.y = 700 - 300
    panelBg.addChild(statsBlock)

    entityInfo = new BitmapText('Entity Information', {
        fontName: 'buttontext_white',
        fontSize: 16,
        align: 'left',
        tint: 0x00CC00,
        maxWidth: 368
    })
    entityInfo.x = 24
    entityInfo.y = 700 - 280
    panelBg.addChild(entityInfo)

    currentCoordinate = new BitmapText('0, 0', {
        fontName: 'sans-serif',
        fontSize: 18,
        align: 'right',
    })
    currentCoordinate.x = window.innerWidth - 166
    currentCoordinate.y = 16
    currentCoordinate.maxWidth = 150
    uiOverlay.addChild(currentCoordinate)

    fps = new BitmapText('FPS: 60', {
        fontName: 'sans-serif',
        fontSize: 18,
        align: 'right',
    })
    fps.x = window.innerWidth - 166
    fps.y = 40
    fps.maxWidth = 150
    uiOverlay.addChild(fps)

    const bgContainer = new TilingSprite(loadedAssets.bgTexture, 4096, 4096);

    app.stage.addChild(bgContainer)
    app.stage.addChild(universeView);
    app.stage.addChild(systemView);
    app.stage.addChild(uiOverlay);
}
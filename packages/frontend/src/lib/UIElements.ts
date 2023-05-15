import {Viewport} from "pixi-viewport";
import {totalSize} from "@app/lib/consts";
import {Application, BitmapText, Container, Graphics, NineSlicePlane, Point, TilingSprite} from "pixi.js";
import {loadedAssets} from "@app/lib/assets";
import {Button} from "@app/lib/button";
import {GameState} from "@app/lib/game-state";
import {trpc} from "@app/lib/trpc";
import {availableActions} from "@app/lib/availableActions";
import { Simple, SpatialHash } from "pixi-cull"

export let universeView: Viewport
export let systemView: Viewport
export let uiOverlay: Container
export let currentCoordinate: BitmapText
export let fps: BitmapText
export let currentSelected: BitmapText
export let credits: BitmapText
export let backButton: Button
export let actionButton: Record<string, Button> = {}
export let entityInfo: BitmapText
export let universeCuller: Simple
export let universeGraphics: Graphics
export let universeGraphicsText: BitmapText

export let systemGraphics: Graphics
export let systemGraphicsText: BitmapText

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



    backButton = new Button('Back', {
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

    credits = new BitmapText('Credits: 0', {
        fontName: 'buttontext',
        fontSize: 16,
        align: 'left',
    })
    credits.x = 16
    credits.y = 200
    panelBg.addChild(credits)

    const actionPanelY = window.innerHeight - 16 - Math.ceil(availableActions.length / 2) * 64

    availableActions.forEach((action, index) => {
        actionButton[action.name] = new Button(action.name, {
            height: 64,
            width: 368/2
        }, action.action)
        actionButton[action.name].y = actionPanelY + Math.floor(index / 2) * 64;
        actionButton[action.name].x = index % 2 == 0 ? 200 : 16
        actionButton[action.name].disabled = true
        panelBg.addChild(actionButton[action.name])
    })

    const cruiseModeButtons = ['CRUISE', 'DRIFT', 'BURN', 'STEALTH']
    cruiseModeButtons.forEach((button, index) => {
        const but = new Button(button, {
            textSize: 16,
            height: 48,
            width: 368/4
        }, async () => {
            await trpc.instructPatchNavigate.mutate({
                shipSymbol: GameState.selected?.symbol,
                navMode: button
            })
        })
        but.y = actionPanelY - 64
        but.x = 16 + (368/4 * index)
        panelBg.addChild(but)
    })

    uiOverlay.addChild(panelBg);

    entityInfo = new BitmapText('Entity Information', {
        fontName: 'buttontext',
        fontSize: 16,
        align: 'left',
        maxWidth: 368
    })
    entityInfo.x = 16
    entityInfo.y = window.innerHeight - 500
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


    currentSelected = new BitmapText('Selected: ', {
        fontName: 'buttontext',
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
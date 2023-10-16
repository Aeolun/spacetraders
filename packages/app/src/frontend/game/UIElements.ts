import {Viewport} from "pixi-viewport";
import {gameWidth, totalSize} from "@front/game/consts";
import {Application, Text, Container, Graphics, Point, TilingSprite} from "pixi.js";
import {loadedAssets} from "@front/game/assets";
import {trpc} from "@front/trpc";
import { Simple, SpatialHash } from "pixi-cull"

export let universeView: Viewport
export let systemView: Viewport
export let uiOverlay: Container
export let currentCoordinate: Text
export let fps: Text
export let universeCuller: Simple
export let universeGraphics: Graphics
export let universeGraphicsText: Text

export let systemGraphics: Graphics
export let systemGraphicsText: Text


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

    systemGraphicsText = new Text({
        text: "",
        style: {
            fontFamily: 'sans-serif',
            fontSize: 16,
            //tint: 0x0000FF,
            align: 'right',
        }
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
    const starContainer = new Container()
    starContainer.name = 'stars'
    universeView.addChild(starContainer)
    universeCuller = new Simple() // new SpatialHash()
    universeCuller.cull(universeView.getVisibleBounds())
    universeGraphics = new Graphics()
    universeView.addChild(universeGraphics)

    universeGraphicsText = new Text({
        text: "",
        style: {
            fontFamily: 'sans-serif',
            fontSize: 16,
            //tint: 0x0000FF,
            align: 'right',
        }
    })
    universeView.addChild(universeGraphicsText)


    uiOverlay = new Container()
    const popupOverlay = new Container()



    currentCoordinate = new Text({
        text: '0, 0',
        style: {
            fontFamily: 'sans-serif',
            fontSize: 18,
            align: 'right',
        }
    })
    currentCoordinate.x = gameWidth - 166
    currentCoordinate.y = 16
    currentCoordinate.maxWidth = 150
    uiOverlay.addChild(currentCoordinate)

    fps = new Text({
        text: 'FPS: 60',
        style: {
            fontFamily: 'sans-serif',
            fontSize: 18,
            align: 'right',
        }
    })
    fps.x = gameWidth - 166
    fps.y = 40
    fps.maxWidth = 150
    uiOverlay.addChild(fps)

    const bgContainer = new TilingSprite(loadedAssets.bgTexture, 4096, 4096);

    app.stage.addChild(bgContainer)
    app.stage.addChild(universeView);
    app.stage.addChild(systemView);
    app.stage.addChild(uiOverlay);
    app.stage.addChild(popupOverlay);
}
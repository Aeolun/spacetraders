import {Viewport} from "pixi-viewport";
import {Application, Text, Container, Graphics, Point, TilingSprite} from "pixi.js";
import {loadedAssets} from "@front/viewer/assets";

export let universeView: Viewport
export let uiOverlay: Container

export let starsContainer  = new Container()
// export let universeCuller: Simple
export let universeGraphics: Graphics
export let universeGraphicsText: Text


export const createUIElements = (app: Application) => {
    let pointerDownPlace: Point | undefined;

    universeView = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,


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
    universeView.moveCenter(0, 0)
    const starContainer = new Container()
    starContainer.name = 'stars'
    universeView.addChild(starContainer)
    // universeCuller = new Simple() // new SpatialHash()
    // universeCuller.cull(universeView.getVisibleBounds())
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

    const bgContainer = new TilingSprite({
        texture: loadedAssets.bgTexture,
        width: 4096,
        height: 4096
    });

    app.stage.addChild(bgContainer)
    app.stage.addChild(universeView);
    app.stage.addChild(uiOverlay);
    app.stage.addChild(popupOverlay);
}
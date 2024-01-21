import {Viewport} from "pixi-viewport";
import {Application, Text, Container, Graphics, Point, TilingSprite} from "pixi.js";
import {loadedAssets} from "@front/viewer/assets";

export let universeView: Viewport
export let starLayer: Container
export let shipLayer: Container
export let iconLayer: Container
export let labelLayer: Container
export let uiOverlay: Container

export let overlayLayer: Container

export let starsContainer  = new Container()
// export let universeCuller: Simple
export let universeGraphics: Graphics
export let universeGraphicsText: Text


export const createUIElements = (app: Application) => {
    let pointerDownPlace: Point | undefined;

    universeView = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        disableOnContextMenu: true,

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

    overlayLayer = new Container()
    overlayLayer.label = 'overlay'
    universeView.addChild(overlayLayer)

    starLayer = new Container()
    starLayer.label = 'stars'
    universeView.addChild(starLayer)

    shipLayer = new Container()
    shipLayer.label = 'ships'
    universeView.addChild(shipLayer)

    iconLayer = new Container()
    iconLayer.label = 'icons'
    universeView.addChild(iconLayer)

    labelLayer = new Container()
    labelLayer.label = 'labels'
    universeView.addChild(labelLayer)

    const influenceGraphics = new Graphics()
    // highlightmodes.Factions(influenceGraphics)
    influenceGraphics.name = 'highlight'
    universeView.addChild(influenceGraphics);

    const routeGraphics = new Graphics()
    routeGraphics.name = 'route'
    universeView.addChild(routeGraphics)

    const homeSystemGraphics = new Graphics()
    homeSystemGraphics.name = 'homeSystem'
    universeView.addChild(homeSystemGraphics)

    universeView.addChild(starsContainer)

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
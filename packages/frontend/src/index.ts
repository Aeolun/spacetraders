import {
    Application,
    Sprite,
    Assets,
    Container,
    Texture,
    TilingSprite,
    Text,
    BitmapText,
    Spritesheet,
    DisplayObject
} from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow'
import {Rectangle} from "@pixi/core";
import { Viewport } from 'pixi-viewport'
import systems from '@spacetraders/backend/systems.json'

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@spacetraders/backend';
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:4001',
        }),
    ],
});

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application({
    resizeTo: window
});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);
const totalSize = 500000
const universeView = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: totalSize,
    worldHeight: totalSize,

    events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})

const systemView = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 500,
    worldHeight: 500,
    events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})
systemView.visible = false

systemView.moveCenter(250, 250)

universeView.moveCenter(totalSize/2, totalSize/2)

universeView
    .drag()
    .pinch()
    .wheel()
    .decelerate()

systemView
    .drag()
    .pinch()
    .wheel()
    .decelerate()

// load the texture we need
const sheet: Spritesheet = await Assets.load('stars.json');
const planetsheet: Spritesheet = await Assets.load('planets.json');
const font = await Assets.load('font.fnt');
const bgTexture = await Assets.load('starfield.png');
const starTexture: Texture = await Assets.load('stars.png');
starTexture.frame = new Rectangle(0,0,64,64)
const starTexture2 = starTexture.clone()
starTexture2.frame = new Rectangle(0, 64, 64, 64)
const yellowStar = starTexture.clone()
yellowStar.frame = new Rectangle(64, 0, 64, 64)

app.stage.interactive = true;
app.stage.hitArea = app.screen;

const uiOverlay = new Container()

const bgContainer = new TilingSprite(bgTexture, 4096, 4096);

let minX = 0, minY = 0, maxX = 0, maxY = 0
for(const starData of systems) {
    if (starData.x < minX) minX = starData.x
    if (starData.x > maxX) maxX = starData.x
    if (starData.y < minY) minY = starData.y
    if (starData.y > maxY) maxY = starData.y
}

const references = {}

function makeInteractiveAndGlowy(item: Container<DisplayObject>) {
    item.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    item.cursor = 'pointer';
    item.on('mouseover', () => {
        //star.alpha = 0.5
        item.filters = [new GlowFilter()]
    })
    item.on('mouseout', () => {
        //star.alpha = 1
        item.filters = []
    })
}

for(const starData of systems) {
    let texture = sheet.textures[`planets/tile/${starData.type}.png`]

    const star = new Sprite(texture)
    const text = new BitmapText(starData.symbol, {
        fontName: 'sans-serif',
        fontSize: 18,
        align: 'right',
    })

    const starContainer = new Container();
    starContainer.addChild(star)
    starContainer.addChild(text)

    makeInteractiveAndGlowy(starContainer)

    starContainer.on('click', () => {
        trpc.dataForDisplay.query({
            system: starData.symbol,
        }).then(result => {
            console.log('result from query', result)
            universeView.visible = false
            systemView.visible = true

            const star = new Sprite(texture)
            systemView.addChild(star)

            const backButton = new BitmapText('Back', {
                fontName: 'sans-serif',
                fontSize: 32,
                align: 'right',
            })
            makeInteractiveAndGlowy(backButton)
            backButton.x = 32
            backButton.y = 1200
            backButton.on('click', () => {
                universeView.visible = true
                systemView.visible = false
                systemView.removeChildren()
            })
            uiOverlay.addChild(backButton)

            result.filter(item => !item.orbitsSymbol).forEach(item => {
                const itemGroup = new Container()
                makeInteractiveAndGlowy(itemGroup)

                const itemSprite = new Sprite(planetsheet.textures[`planets/tile/${item.type}.png`])
                itemGroup.x = item.x * 8
                itemGroup.y = item.y * 8
                itemGroup.addChild(itemSprite)

                const text = new BitmapText(item.symbol.replace(starData.symbol+'-', '') + ' - ' + item.type, {
                    fontName: 'sans-serif',
                    fontSize: 16,
                    align: 'right',
                })
                text.x = 0
                text.y = 70
                itemGroup.addChild(text);


                result.filter(orbitingThing => orbitingThing.orbitsSymbol === item.symbol).forEach((orbitingThing, index) => {
                    const orbitingGroup = new Container()
                    makeInteractiveAndGlowy(orbitingGroup)

                    const orbitingSprite = new Sprite(planetsheet.textures[`planets/tile/${orbitingThing.type}.png`])
                    orbitingSprite.scale = {x: 0.75, y: 0.75}
                    orbitingGroup.x = item.x * 8 + 32
                    orbitingGroup.y = item.y * 8 + 80 + 64*index
                    orbitingGroup.addChild(orbitingSprite)

                    const orbitingText = new BitmapText(orbitingThing.symbol.replace(starData.symbol+'-', '') + ' - ' + orbitingThing.type, {
                        fontName: 'sans-serif',
                        fontSize: 16,
                        align: 'right',
                    })
                    orbitingText.x = 60
                    orbitingText.y = 16
                    orbitingGroup.addChild(orbitingText)

                    systemView.addChild(orbitingGroup)
                })

                systemView.addChild(itemGroup)
            })
        })
    })

    starContainer.x = (starData.x+Math.abs(minX))/(maxX-minX)*totalSize
    starContainer.y = (starData.y+Math.abs(minY))/(maxY-minY)*totalSize

    text.x = 0
    text.y = 70
    universeView.addChild(starContainer)
    references[starData.symbol] = starContainer
}

universeView.moveCenter(references['X1-VU95'].x, references['X1-VU95'].y)
app.stage.addChild(bgContainer)
// Add the bunny to the scene we are building
app.stage.addChild(universeView);
app.stage.addChild(systemView);
app.stage.addChild(uiOverlay);

// Listen for frame updates
app.ticker.add(() => {
    // each frame we spin the bunny around a bit
    const sizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth
    Object.values(references).forEach(ref => {
        ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
    })
});
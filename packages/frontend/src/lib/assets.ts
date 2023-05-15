import {Assets, BitmapFont, BitmapText, Spritesheet, Texture} from "pixi.js";

export let loadedAssets: {
    sheet: Spritesheet,
    planetsheet: Spritesheet,
    uisheet: Spritesheet
    font: BitmapFont,
    buttonText: BitmapFont,
    bgTexture: Texture,
    navArrow: Texture,
    starTexture: Texture,
    spaceshipTexture: Texture,
    panel: Texture
    asteroidBelt: Texture
    button: Texture
    panelBg: Texture
    shipyard: Texture
    market: Texture
} = {}

export async function loadAssets() {
    const sheet: Spritesheet = await Assets.load('stars.json');
    const planetsheet: Spritesheet = await Assets.load('planets.json');
    const uisheet: Spritesheet = await Assets.load('uisheet.json');
    const font = await Assets.load('font.fnt');
    const buttonText = await Assets.load('buttontext.fnt')
    const bgTexture = await Assets.load('starfield.png');
    const navArrow = await Assets.load('navarrow.png');
    const starTexture: Texture = await Assets.load('stars.png');
    const shipyard: Texture = await Assets.load('shipyard.png');
    const asteroidBelt: Texture = await Assets.load('asteroid_belt.png');
    const market: Texture = await Assets.load('money-bag-xxl.png');
    const spaceshipTexture: Texture = await Assets.load('spaceship.png');

    loadedAssets = {
        sheet,
        planetsheet,
        uisheet,
        font,
        buttonText,
        bgTexture,
        navArrow,
        starTexture,
        spaceshipTexture,
        asteroidBelt,
        shipyard,
        market,
        panel: await Assets.load("ui/panel.png"),
        button: await Assets.load("ui/button.png"),
        panelBg: await Assets.load("ui/panelbg.png"),
    }
}
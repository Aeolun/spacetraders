import {Assets, BitmapFont, BitmapText, Spritesheet, Texture} from "pixi.js";

export let loadedAssets: {
    sheet: Spritesheet,
    planetsheet: Spritesheet,
    uisheet: Spritesheet
    font: BitmapFont,
    buttonTextWhite: BitmapFont,
    buttonText: BitmapFont,
    bgTexture: Texture,
    navArrow: Texture,
    starTexture: Texture,
    spaceshipTexture: Texture,
    panel: Texture
    asteroidBelt: Texture
    button: Texture
    statsBlock: Texture
    select: Texture
    selectInactive: Texture
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
    const segment = await Assets.load('segment.fnt')
    const buttonTextWhite = await Assets.load('buttontext_white.fnt')
    const bgTexture = await Assets.load('starfield.png');
    const navArrow = await Assets.load('navarrow.png');
    const starTexture: Texture = await Assets.load('stars.png');
    const shipyard: Texture = await Assets.load('shipyard.png');
    const select: Texture = await Assets.load('ui/select.png')
    const statsBlock: Texture = await Assets.load('ui/stats.png')
    const selectInactive: Texture = await Assets.load('ui/select_inactive.png')
    const asteroidBelt: Texture = await Assets.load('asteroid_belt.png');
    const market: Texture = await Assets.load('money-bag-xxl.png');
    const spaceshipTexture: Texture = await Assets.load('spaceship.png');

    loadedAssets = {
        sheet,
        planetsheet,
        uisheet,
        font,
        buttonText,
        buttonTextWhite,
        bgTexture,
        navArrow,
        starTexture,
        statsBlock,
        spaceshipTexture,
        asteroidBelt,
        shipyard,
        select,
        selectInactive,
        market,
        panel: await Assets.load("ui/panel.png"),
        button: await Assets.load("ui/button.png"),
        panelBg: await Assets.load("ui/panelbg.png"),
    }
}
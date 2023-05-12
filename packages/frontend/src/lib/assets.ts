import {Assets, BitmapFont, Spritesheet, Texture} from "pixi.js";

export let loadedAssets: {
    sheet: Spritesheet,
    planetsheet: Spritesheet,
    uisheet: Spritesheet
    font: BitmapFont,
    bgTexture: Texture,
    navArrow: Texture,
    starTexture: Texture,
    spaceshipTexture: Texture
} = {}

export async function loadAssets() {
    const sheet: Spritesheet = await Assets.load('stars.json');
    const planetsheet: Spritesheet = await Assets.load('planets.json');
    const uisheet: Spritesheet = await Assets.load('uisheet.json');
    const font = await Assets.load('font.fnt');
    const bgTexture = await Assets.load('starfield.png');
    const navArrow = await Assets.load('navarrow.png');
    const starTexture: Texture = await Assets.load('stars.png');
    const spaceshipTexture: Texture = await Assets.load('spaceship.png');

    loadedAssets = {
        sheet,
        planetsheet,
        uisheet,
        font,
        bgTexture,
        navArrow,
        starTexture,
        spaceshipTexture
    }
}
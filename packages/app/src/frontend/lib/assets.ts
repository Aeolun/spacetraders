import {Assets, BitmapFont, BitmapText, Sprite, Spritesheet, Texture} from "pixi.js";

export let loadedAssets: {
    sheet: Spritesheet,
    planetsheet: Spritesheet,
    uisheet: Spritesheet
    buttonsheet: Spritesheet,
    font: BitmapFont,
    buttonTextWhite: BitmapFont,
    buttonText: BitmapFont,
    bgTexture: Texture,
    navArrow: Texture,
    starTexture: Texture,
    spaceshipTexture: Texture,
    spaceshipTextures: Record<string, Texture>
    panel2: Texture,
    panelInvisible: Texture,
    panel: Texture
    asteroidBelt: Texture
    button: Texture
    statsBlock: Texture
    station: Texture
    treasure: Texture
    select: Texture
    selectInactive: Texture
    jumpgate: Texture
    panelBg: Texture
    shipyard: Texture
    market: Texture
} = {}

export async function loadAssets() {
    const sheet: Spritesheet = await Assets.load('stars.json');
    const planetsheet: Spritesheet = await Assets.load('planets.json');
    const uisheet: Spritesheet = await Assets.load('uisheet.json');
    const buttonSheet: Spritesheet = await Assets.load('ui/button.json');
    const font = await Assets.load('font.fnt');
    const buttonText = await Assets.load('buttontext.fnt')
    const segment = await Assets.load('segment.fnt')
    const buttonTextWhite = await Assets.load('buttontext_white.fnt')
    const bgTexture = await Assets.load('starfield.png');
    const navArrow = await Assets.load('navarrow.png');
    const starTexture: Texture = await Assets.load('stars.png');
    const shipyard: Texture = await Assets.load('shipyard.png');
    const station:Texture = await Assets.load('station.png');
    const jumpgate: Texture = await Assets.load('jumpgate.png');
    const treasure: Texture = await Assets.load('treasure-map.png');
    const select: Texture = await Assets.load('ui/select.png')
    const statsBlock: Texture = await Assets.load('ui/stats.png')
    const panel2: Texture = await Assets.load('ui/panel2.png')
    const panelInvisible: Texture = await Assets.load('ui/panel_invisible.png')
    const selectInactive: Texture = await Assets.load('ui/select_inactive.png')
    const asteroidBelt: Texture = await Assets.load('asteroid_belt.png');
    const market: Texture = await Assets.load('money-bag-xxl.png');
    const spaceshipTexture: Texture = await Assets.load('spaceship.png');
    const probeTexture: Texture = await Assets.load('ships/PROBE.png');
    const lightFreighterTexture: Texture = await Assets.load('ships/LIGHT_FREIGHTER.png');

    loadedAssets = {
        sheet,
        planetsheet,
        uisheet,
        font,
        buttonsheet: buttonSheet,
        buttonText,
        buttonTextWhite,
        bgTexture,
        navArrow,
        panelInvisible,
        starTexture,
        statsBlock,
        panel2,
        station,
        jumpgate,
        treasure,
        spaceshipTexture,
        spaceshipTextures: {
            FRAME_PROBE: probeTexture,
            FRAME_LIGHT_FREIGHTER: lightFreighterTexture,
            FRAME_EXPLORER: await Assets.load('ships/FRAME_EXPLORER.png')
        },
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
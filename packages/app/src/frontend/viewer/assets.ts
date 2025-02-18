import {Assets, Spritesheet, SpritesheetData, Texture} from "pixi.js";

export async function loadAssetsData() {
    const buttonSheet: Spritesheet = await Assets.load('ui/button.json');
    const spritesheet: Spritesheet = await Assets.load('spritesheet.json');
    const sansSerif = await Assets.load('sans-serif.fnt');
    const buttonText = await Assets.load('buttontext.fnt')
    const segment = await Assets.load('segment.fnt')
    const use_font = await Assets.load('use_font.fnt')
    const buttonTextWhite = await Assets.load('buttontext_white.fnt')
    const bgTexture = await Assets.load('background4.jpg');
    const starTexture: Texture = await Assets.load('stars.png');
    const select: Texture = await Assets.load('ui/select.png')
    const statsBlock: Texture = await Assets.load('ui/stats.png')
    const panel2: Texture = await Assets.load('ui/panel2.png')
    const panelInvisible: Texture = await Assets.load('ui/panel_invisible.png')
    const selectInactive: Texture = await Assets.load('ui/select_inactive.png')
    const tradeArrow: Spritesheet<SpritesheetData & {
        animations: 'animate'
    }> = await Assets.load('textures/effects/TRADE_ARROWS.json')
  const engineflame: Spritesheet<SpritesheetData & {
    animations: 'animate'
  }> = await Assets.load('textures/effects/engineflame.json')
  const laser: Spritesheet<SpritesheetData & {
    animations: 'animate'
  }> = await Assets.load('textures/effects/laser.json')


    return {
        sansSerif,
        buttonsheet: buttonSheet,
        buttonText,
        buttonTextWhite,
        bgTexture,
        navArrow: spritesheet.textures['nav-arrow.png'],
        panelInvisible,
        starTexture,
        spritesheet,
        statsBlock,
        tradeArrow: tradeArrow.animations.animate,
        engineflame: engineflame.animations.animate,
      laser: laser.animations.animate,
        panel2,
        station: spritesheet.textures['station.png'],
        jumpgate: spritesheet.textures['jumpgate.png'],
        treasure: spritesheet.textures['treasure.png'],
        asteroidBelt: spritesheet.textures['asteroid-belt.png'],
        shipyard: spritesheet.textures['shipyard.png'],
        select,
        selectInactive,
        market: spritesheet.textures['market.png'],
        panel: await Assets.load("ui/panel.png"),
        asteroid2: spritesheet.textures['asteroid2.png'],
        button: await Assets.load("ui/button.png"),
        panelBg: await Assets.load("ui/panelbg.png"),
    }
}

export let loadedAssets: Awaited<ReturnType<typeof loadAssetsData>>

export async function loadAssets() {
    loadedAssets = await loadAssetsData()
}
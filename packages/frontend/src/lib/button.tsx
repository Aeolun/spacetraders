import {BitmapText, Container, NineSlicePlane} from "pixi.js";
import {loadedAssets} from "@app/lib/assets";
import {Rectangle} from "@pixi/core";

export class Button extends Container {
    buttonSprite: NineSlicePlane

    constructor(name: string, dimensions: { width: number, height: number }) {
        super()

        this.interactive = true;
        this.buttonSprite = new NineSlicePlane(loadedAssets.uisheet.textures["uisheet/tile/button_inactive.png"], 15,15,15,15)
        this.buttonSprite.width = dimensions.width
        this.buttonSprite.height = dimensions.height

        this.addChild(this.buttonSprite)

        this.cursor = 'pointer';
        this.on('mouseover', () => {
            this.buttonSprite.texture = loadedAssets.uisheet.textures["uisheet/tile/button_active.png"]
        })
        this.on('mouseout', () => {
            this.buttonSprite.texture = loadedAssets.uisheet.textures["uisheet/tile/button_inactive.png"]
        })

        const text = new BitmapText(name, {
            fontName: 'sans-serif',
            fontSize: 32,
            align: 'right',
        })
        text.x = (dimensions.height - 32) / 2
        text.y = (dimensions.height - 32) / 2
        this.addChild(text)
    }


}
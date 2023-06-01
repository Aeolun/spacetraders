import {BitmapText, Container, FederatedPointerEvent, IBitmapTextStyle, NineSlicePlane, Rectangle} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";

export class CenteredBitmapText extends Container {
    bitmapText: BitmapText
    bounds: Rectangle

    constructor(name: string, fontProperties: Partial<IBitmapTextStyle>) {
        super()

        this.bitmapText = new BitmapText(name, fontProperties)
        this.bounds = this.bitmapText.getBounds()

        this.addChild(this.bitmapText)
    }

    set width(value: number) {
        this.bitmapText.x = (value - this.bounds.width)/2
    }

    set height(value: number) {
        this.bitmapText.y = (value - this.bounds.height)/2
    }
}
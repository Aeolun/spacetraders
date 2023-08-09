import {BitmapText, Container, IBitmapTextStyle, Rectangle} from "pixi.js";

export interface CenteredBitmapTextProperties {
    align: 'left' | 'right' | 'center'
    font: Partial<IBitmapTextStyle>
}

export class CenteredBitmapText extends Container {
    bitmapText: BitmapText
    bounds: Rectangle

    constructor(name: string, private properties: CenteredBitmapTextProperties) {
        super()

        this.bitmapText = new BitmapText(name, properties.font)
        this.bounds = this.bitmapText.getBounds()

        this.addChild(this.bitmapText)
    }

    set width(value: number) {
        if (this.properties.align === 'left') {
            this.bitmapText.x = 8
        } else if(this.properties.align === 'right') {
            this.bitmapText.x = value - this.bounds.width - 8
        } else {
            this.bitmapText.x = (value - this.bounds.width) / 2
        }
    }

    set height(value: number) {
        this.bitmapText.y = (value - this.bounds.height)/2
    }
}
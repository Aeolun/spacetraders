import {BitmapText, Container, FederatedPointerEvent, NineSlicePlane} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";

export class Button extends Container {
    buttonSprite: NineSlicePlane
    private isDisabled = false

    constructor(name: string, dimensions: { width: number, height: number, textSize?: number }, private clickAction?: (event: FederatedPointerEvent) => void) {
        super()

        this.interactive = true;
        this.buttonSprite = new NineSlicePlane(loadedAssets.button,  4,4,4,4)
        this.buttonSprite.width = dimensions.width
        this.buttonSprite.height = dimensions.height

        this.addChild(this.buttonSprite)

        this.cursor = 'pointer';
        this.on('mouseover', () => {
            this.buttonSprite.texture = loadedAssets.button
            if (!this.isDisabled) {
                this.alpha = 1
            }
        })
        this.on('mouseout', () => {
            this.buttonSprite.texture = loadedAssets.button
            if (!this.isDisabled) {
                this.alpha = 0.9
            }
        })
        if (this.clickAction) {
            this.on('click', this.clickAction)
        }

        const textSize = dimensions.textSize ?? 32
        const text = new BitmapText(name, {
            fontName: 'buttontext',
            fontSize: textSize,
            align: 'center',
        })
        text.x = (dimensions.height - textSize) / 2
        text.y = (dimensions.height - textSize) / 2
        this.addChild(text)
    }

    set disabled(disabled: boolean) {
        if (disabled && !this.isDisabled) {
            console.log("flip disabled")
            this.alpha = 0.5
            this.cursor = 'default'
            this.isDisabled = true
            this.off('click')
        } else if (!disabled && this.isDisabled) {
            console.log("flip enabled")
            this.alpha = 0.9
            this.cursor = 'pointer'
            this.isDisabled = false
            if (this.clickAction) {
                this.on('click', this.clickAction)
            }
        }
    }

    get disabled() {
        return this.isDisabled
    }
}
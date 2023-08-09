import {BitmapText, Container, FederatedPointerEvent, NineSlicePlane} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";

export interface BaseButtonProperties { width?: number, height?: number, textSize?: number }

export class BaseButton extends NineSlicePlane {
    private isDisabled = false
    bitmapText: BitmapText

    constructor(text: string, baseButtonProperties?: BaseButtonProperties, private clickAction?: (event: FederatedPointerEvent) => void) {
        super(loadedAssets.buttonsheet.textures['button#default'],  3,3,3,3)

        const textSize = baseButtonProperties.textSize ?? 16
        this.bitmapText = new BitmapText(text, {
            fontName: 'buttontext_white',
            fontSize: textSize,
            tint: 0x00FF00,
            align: 'center',
        })

        this.interactive = true;
        this.width = baseButtonProperties?.width ?? 200
        this.height = baseButtonProperties?.height ?? 40

        this.cursor = 'pointer';
        this.on('mouseover', () => {
            if (!this.isDisabled) {
                this.texture = loadedAssets.buttonsheet.textures['button#hover']
            }
        })
        this.on('mouseout', () => {
            if (!this.isDisabled) {
                this.texture = loadedAssets.buttonsheet.textures['button#default']
            }
        })
        this.on('mousedown', () => {
            if (!this.isDisabled) {
                this.texture = loadedAssets.buttonsheet.textures['button#down']
            }
        })
        this.on('mouseup', () => {
            if (!this.isDisabled) {
                this.texture = loadedAssets.buttonsheet.textures['button#hover']
            }
        })
        this.on("mouseupoutside", () => {
            if (!this.isDisabled) {
                this.texture = loadedAssets.buttonsheet.textures['button#default']
            }
        })
        if (this.clickAction) {
            this.on('click', this.clickAction)
        }



        this.addChild(this.bitmapText)
    }

    set width(value: number) {
        this.bitmapText.x = (value - this.bitmapText.getBounds().width) / 2

        super.width = value
    }
    set height(value: number) {
        this.bitmapText.y = (value - this.bitmapText.getBounds().height) / 2

        super.height = value
    }

    set disabled(disabled: boolean) {
        if (disabled && !this.isDisabled) {
            console.log("flip disabled")
            this.texture = loadedAssets.buttonsheet.textures['button#disabled']
            this.cursor = 'default'
            this.bitmapText.tint = 0xAAAAAA
            this.isDisabled = true
            this.off('click')
        } else if (!disabled && this.isDisabled) {
            console.log("flip enabled")
            this.texture = loadedAssets.buttonsheet.textures['button#default']
            this.cursor = 'pointer'
            this.bitmapText.tint = 0x00FF00
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
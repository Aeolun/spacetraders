import {BitmapText, Container, FederatedPointerEvent, NineSlicePlane} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";

export class Switch extends Container {
    optionSprites: Record<string, NineSlicePlane> = {}
    selectedValue?: string

    constructor(options: string[], dimensions: { width: number, textSize?: number, defaultSelected?: string }, private clickAction?: (event: FederatedPointerEvent, selectedOption: string) => void) {
        super()

        this.selectedValue = dimensions.defaultSelected

        options.forEach((option, index) => {
            this.optionSprites[option] = new NineSlicePlane(option === this.selectedValue ? loadedAssets.select : loadedAssets.selectInactive,  15,5,15,5)
            this.optionSprites[option].interactive = true;
            this.optionSprites[option].width = dimensions.width / options.length
            this.optionSprites[option].height = 41
            this.optionSprites[option].x = (dimensions.width / options.length) * index

            this.addChild(this.optionSprites[option])

            this.optionSprites[option].cursor = 'pointer';
            this.optionSprites[option].on('mouseover', () => {
                this.optionSprites[option].texture = loadedAssets.select
            })
            this.optionSprites[option].on('mouseout', () => {
                if (this.selectedValue !== option) {
                    this.optionSprites[option].texture = loadedAssets.selectInactive
                }
            })

            this.optionSprites[option].on('click', (event) => {
                event.stopPropagation();
                this.switchHighlight(option)
                if (this.clickAction) {
                    this.clickAction(event, option)
                }
            })

            const textSize = dimensions.textSize ?? 20
            const text = new BitmapText(option, {
                fontName: 'buttontext_white',
                fontSize: textSize,
                align: 'center',
                tint: 0xFFFFFF,
            })
            text.x = 20
            text.y = 10 + (20 - dimensions.textSize) / 2
            this.optionSprites[option].addChild(text)
        })
    }

    switchHighlight(value: string) {
        if (this.selectedValue) {
            this.optionSprites[this.selectedValue].texture = loadedAssets.selectInactive
        }
        this.selectedValue =  value
        this.optionSprites[this.selectedValue].texture = loadedAssets.select
    }

    setSelectedValue(value: string) {
        this.switchHighlight(value)
    }
}
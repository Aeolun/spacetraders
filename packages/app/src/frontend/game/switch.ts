import {BitmapText, FederatedPointerEvent} from "pixi.js";
import {loadedAssets} from "@front/game/assets";
import {Container} from "@front/game/ui-elements/container";
import {FlexDirection} from "@front/game/Flex";
import {Text} from "@front/game/ui-elements/text";

export class Switch extends Container {
    optionSprites: Record<string, Container> = {}
    selectedValue?: string

    constructor(options: string[], dimensions: { width: number, textSize?: number, defaultSelected?: string }, private clickAction?: (event: FederatedPointerEvent, selectedOption: string) => void) {
        super({
            variant: 'invisible'
        })
        this.width = '100%'
        this.height = 41
        this.flexDirection = FlexDirection.ROW

        this.selectedValue = dimensions.defaultSelected

        options.forEach((option, index) => {
            this.optionSprites[option] = new Container({
                variant: 'custom',
                texture: option === this.selectedValue ? loadedAssets.select : loadedAssets.selectInactive,
                xBand: 15,
                yBand: 5
            })
            this.optionSprites[option].displayObject.interactive = true;
            this.optionSprites[option].flex = 1

            this.addChild(this.optionSprites[option])

            this.optionSprites[option].displayObject.cursor = 'pointer';
            this.optionSprites[option].displayObject.on('mouseover', () => {
                this.optionSprites[option].displayObject.texture = loadedAssets.select
            })
            this.optionSprites[option].displayObject.on('mouseout', () => {
                if (this.selectedValue !== option) {
                    this.optionSprites[option].displayObject.texture = loadedAssets.selectInactive
                }
            })

            this.optionSprites[option].displayObject.on('click', (event) => {
                event.stopPropagation();
                this.switchHighlight(option)
                if (this.clickAction) {
                    this.clickAction(event, option)
                }
            })

            const textSize = dimensions.textSize ?? 20
            const text = new Text(option, {
                font: {
                    fontName: 'buttontext_white',
                    fontSize: textSize,

                    tint: 0xFFFFFF,
                },
                align: 'center',
            })
            text.flex = 1
            this.optionSprites[option].addChild(text)
        })
    }

    switchHighlight(value: string) {
        if (this.selectedValue) {
            this.optionSprites[this.selectedValue].displayObject.texture = loadedAssets.selectInactive
        }
        this.selectedValue =  value
        this.optionSprites[this.selectedValue].displayObject.texture = loadedAssets.select
    }

    setSelectedValue(value: string) {
        this.switchHighlight(value)
    }
}
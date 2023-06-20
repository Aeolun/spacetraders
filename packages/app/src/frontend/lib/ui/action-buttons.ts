import {availableActions} from "@front/lib/availableActions";
import {Button} from "@front/lib/ui-elements/button";
import {FlexDirection, FlexWrap, PositionType} from "@front/lib/Flex";
import {Container} from "@front/lib/ui-elements/container";
import {app} from "@front/lib/application";
import {highlightmodes} from "@front/lib/highlightmodes";
import {universeView} from "@front/lib/UIElements";
import {Graphics} from "pixi.js";


const actionPanelHeight = Math.ceil(availableActions.length / 2) * 48
const actionPanelY = window.innerHeight - 16 - actionPanelHeight

export const createActionButtons = () => {
    const flex = new Container()
    flex.maxWidth = '100%'
    flex.position = PositionType.RELATIVE
    flex.wrap = FlexWrap.WRAP_WRAP;

    flex.flexDirection = FlexDirection.ROW

    availableActions.forEach((action, index) => {
        const button = new Button(action.name, {}, action.action)
        button.width = '50%'
        button.height = 36
        app.ticker.add(() => {
            const isAvailable = action.isAvailable()

            button.disabled = !isAvailable
        })
        button.disabled = true

        flex.addChild(button)
    })

    return flex
}

export const createHighlightButtons = () => {
    const flex = new Container()
    flex.maxWidth = '100%'
    flex.padding = 2
    flex.wrap = FlexWrap.WRAP_WRAP;
    flex.flexDirection = FlexDirection.ROW

    Object.keys(highlightmodes).forEach((action) => {
        const drawFunction = highlightmodes[action]

        const button = new Button(action, {}, () => {
            const highlight = universeView.getChildByName<Graphics>('highlight')
            highlight.clear()
            drawFunction(highlight)
        })
        button.width = '50%'
        button.height = 36

        flex.addChild(button)
    })
    return flex
}
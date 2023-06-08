import {availableActions} from "@front/lib/availableActions";
import {Button} from "@front/lib/ui-elements/button";
import {FlexDirection, FlexWrap} from "@front/lib/Flex";
import {Container} from "@front/lib/ui-elements/container";
import {app} from "@front/lib/application";


const actionPanelHeight = Math.ceil(availableActions.length / 2) * 48
const actionPanelY = window.innerHeight - 16 - actionPanelHeight

export const createActionButtons = () => {
    const flex = new Container()
    flex.height = 250
    flex.width = 400
    flex.padding = 2
    flex.wrap = FlexWrap.WRAP_WRAP;
    flex.flexDirection = FlexDirection.ROW

    availableActions.forEach((action, index) => {
        const button = new Button(action.name, {}, action.action)
        button.width = '47%'
        button.height = 32
        button.margin = 2
        app.ticker.add(() => {
            const isAvailable = action.isAvailable()

            button.disabled = !isAvailable
        })
        button.disabled = true

        flex.addChild(button)
    })
    flex.updateLayout()

    return flex.displayObject
}

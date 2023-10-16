import {Flex} from "@front/game/Flex";
import {BaseButton, BaseButtonProperties} from "@front/game/base-elements/base-button";
import {FederatedPointerEvent} from "pixi.js";

export class Button extends Flex<BaseButton> {
    constructor(text: string, properties: BaseButtonProperties, private clickAction?: (event: FederatedPointerEvent) => void) {
        super(new BaseButton(text, properties, clickAction))
    }

    set disabled(value: boolean) {
        this.displayObject.disabled = value
    }
}


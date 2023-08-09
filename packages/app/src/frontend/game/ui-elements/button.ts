import {Flex} from "@front/lib/Flex";
import {BaseButton, BaseButtonProperties} from "@front/lib/base-elements/base-button";
import {FederatedPointerEvent} from "pixi.js";

export class Button extends Flex<BaseButton> {
    constructor(text: string, properties: BaseButtonProperties, private clickAction?: (event: FederatedPointerEvent) => void) {
        super(new BaseButton(text, properties, clickAction))
    }

    set disabled(value: boolean) {
        this.displayObject.disabled = value
    }
}


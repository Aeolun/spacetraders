import {Flex} from "@front/game/Flex";
import {CenteredBitmapText, CenteredBitmapTextProperties} from "@front/game/base-elements/centered-bitmap-text";

export class Text extends Flex<CenteredBitmapText> {
    constructor(text: string, properties: CenteredBitmapTextProperties) {
        super(new CenteredBitmapText(text, properties ))
    }
}


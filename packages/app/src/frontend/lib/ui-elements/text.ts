import {Flex} from "@front/lib/Flex";
import {CenteredBitmapText, CenteredBitmapTextProperties} from "@front/lib/base-elements/centered-bitmap-text";

export class Text extends Flex<CenteredBitmapText> {
    constructor(text: string, properties: CenteredBitmapTextProperties) {
        super(new CenteredBitmapText(text, properties ))
    }
}


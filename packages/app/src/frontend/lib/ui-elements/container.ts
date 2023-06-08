import {Flex} from "@front/lib/Flex";
import {DisplayObject, NineSlicePlane} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";

export interface ContainerProperties {
    variant: 'default' | 'invisible'
}
export class Container extends Flex<NineSlicePlane> {
    constructor(properties?: ContainerProperties) {
        super(new NineSlicePlane(properties?.variant === 'invisible' ? loadedAssets.panelInvisible : loadedAssets.panel2))
    }
}


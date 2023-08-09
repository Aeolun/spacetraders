import {Flex} from "@front/lib/Flex";
import {DisplayObject, NineSlicePlane, Texture} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";

export type ContainerProperties = {
    variant: 'default' | 'invisible'
} | {
    variant: 'custom'
    texture: Texture,
    xBand?: number,
    yBand?: number
}
export class Container extends Flex<NineSlicePlane> {
    constructor(properties?: ContainerProperties) {
        let innerComponent
        if (properties?.variant === 'custom') {
            innerComponent = new NineSlicePlane(properties.texture, properties.xBand ?? 10, properties.yBand ?? 10, properties.xBand ?? 10, properties.yBand ?? 10)
        } else {
            innerComponent = new NineSlicePlane(properties?.variant === 'invisible' ? loadedAssets.panelInvisible : loadedAssets.panel2)
        }
        super(innerComponent)
    }
}


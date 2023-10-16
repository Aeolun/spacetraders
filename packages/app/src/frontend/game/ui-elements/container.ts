import {Flex} from "@front/game/Flex";
import { NineSliceSprite, Texture} from "pixi.js";
import {loadedAssets} from "@front/game/assets";

export type ContainerProperties = {
    variant: 'default' | 'invisible'
} | {
    variant: 'custom'
    texture: Texture,
    xBand?: number,
    yBand?: number
}
export class Container extends Flex<NineSliceSprite> {
    constructor(properties?: ContainerProperties) {
        let innerComponent
        if (properties?.variant === 'custom') {
            innerComponent = new NineSliceSprite({
                texture: properties.texture, 
                leftWidth: properties.xBand ?? 10, 
                topHeight: properties.yBand ?? 10, 
                rightWidth: properties.xBand ?? 10, 
                bottomHeight: properties.yBand ?? 10
            })
        } else {
            innerComponent = new NineSliceSprite({
                texture: properties?.variant === 'invisible' ? loadedAssets.panelInvisible : loadedAssets.panel2
            })
        }
        super(innerComponent)
    }
}


import {Texture} from "pixi.js";

export const getCenterPivot = (texture: Texture) => {
  if (texture.width % 2 == 1 || texture.height % 2 == 1) {
    throw new Error("Texture must have even width and height")
  }
  return {
    x: texture.width / 2,
    y: texture.height / 2
  }
}
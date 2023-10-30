import {Container, Graphics, PointData, Sprite, Text, Texture} from "pixi.js";
import {loadedAssets} from "@front/viewer/assets";
import {UniverseEntity, UniverseEntityProperties} from "@front/viewer/universe-entity";
import {getCenterPivot} from "@front/viewer/lib/get-center-pivot";

export interface UniverseShipProperties {

}

export class UniverseShip extends UniverseEntity {
  navSprite: Sprite
  scaleFactor = 0.75

  constructor(properties: UniverseEntityProperties & UniverseShipProperties) {
    super(properties);

    this.sprite.scale = {x: this.scaleFactor, y: this.scaleFactor}
    this.navSprite = new Sprite(loadedAssets.navArrow);
    this.navSprite.pivot = getCenterPivot(loadedAssets.navArrow)
    this.navSprite.name = 'nav'
    this.navSprite.visible = false;
    this.addChild(this.navSprite)
  }
}
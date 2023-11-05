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

    //this.sprite.scale = {x: this.scaleFactor, y: this.scaleFactor}
    this.zIndex = 100000
    const texture = loadedAssets.spritesheet.textures['public/textures/navarrow.png']
    this.navSprite = new Sprite(texture)
    this.navSprite.pivot = getCenterPivot(texture)
    this.navSprite.name = 'nav'
    this.navSprite.zIndex = -1
    this.navSprite.visible = false;
    this.addChild(this.navSprite)
  }

  public setAngle(rotation: number) {
    this.sprite.rotation = rotation;
    this.navSprite.rotation = rotation;
  }

  public setNavigating(navigating: boolean) {
    this.navSprite.visible = navigating
  }
}
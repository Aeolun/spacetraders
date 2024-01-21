import {AnimatedSprite, Container, Graphics, PointData, Sprite, Text, Texture} from "pixi.js";
import {loadedAssets} from "@front/viewer/assets";
import {UniverseEntity, UniverseEntityProperties} from "@front/viewer/universe-entity";
import {getCenterPivot} from "@front/viewer/lib/get-center-pivot";
import {ShipNavFlightMode} from "spacetraders-sdk";
import {shipLayer} from "@front/viewer/UIElements";
import {AnimatedTilingSprite} from "@front/viewer/lib/AnimatedTilingSprite";

export interface UniverseShipProperties {

}

export class UniverseShip extends UniverseEntity {
  navSprite: Sprite
  engineFlame: AnimatedSprite
  extractionEffect: AnimatedTilingSprite
  scaleFactor = 0.75

  constructor(properties: UniverseEntityProperties & UniverseShipProperties) {
    super({
      ...properties,
      spriteLayer: shipLayer
    });

    //this.sprite.scale = {x: this.scaleFactor, y: this.scaleFactor}
    const texture = loadedAssets.spritesheet.textures['public/textures/navarrow.png']
    this.navSprite = new Sprite(texture)
    this.navSprite.pivot = getCenterPivot(texture)
    this.navSprite.name = 'nav'
    this.navSprite.zIndex = -1
    this.navSprite.visible = false;

    this.engineFlame = new AnimatedSprite(loadedAssets.engineflame)
    this.engineFlame.pivot.set(7, 32);
    this.engineFlame.animationSpeed = 0.1
    this.engineFlame.loop = true
    this.engineFlame.visible = false
    this.engineFlame.play()
    this.engineFlame.scale.set(1,1)

    this.extractionEffect = new AnimatedTilingSprite(loadedAssets.laser)
    this.extractionEffect.width = 47
    this.extractionEffect.height = 48
    this.extractionEffect.pivot.set(24, 60);
    this.extractionEffect.tint = 0x99ff44
    this.extractionEffect.animationSpeed = 0.1
    this.extractionEffect.currentFrame = Math.round(Math.random() * 8)
    this.extractionEffect.visible = false
    this.extractionEffect.play()

    this.starLayerObject.addChild(this.extractionEffect)
    this.starLayerObject.addChild(this.engineFlame)
    this.starLayerObject.addChild(this.navSprite)
    console.log(this.sprite);
  }

  public setAngle(rotation: number) {
    this.sprite.rotation = rotation;
    this.navSprite.rotation = rotation;
    this.extractionEffect.rotation = rotation+Math.PI*0.5;
    this.engineFlame.rotation = rotation+Math.PI;
  }

  public setNavigating(navigating: boolean, method: ShipNavFlightMode = ShipNavFlightMode.Cruise, pathProgress = 0) {
    //this.navSprite.visible = navigating\
    this.engineFlame.visible = navigating
    if (navigating) {
      if (method === 'CRUISE') {
        this.engineFlame.scale.set(1, 1)
      } else if (method === 'BURN') {
        this.engineFlame.scale.set(1, 3)
      } else if (method === 'DRIFT') {
        if (pathProgress < 0.02) {
          this.engineFlame.scale.set(1, 5)
        } else {
          this.engineFlame.visible = false
        }
      }
    }
  }

  public setExtracting(extracting: boolean, tint = 0x99ff44) {
    this.extractionEffect.visible = extracting
    this.extractionEffect.tint = tint
  }
}
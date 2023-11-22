import {Container, FederatedPointerEvent, Graphics, PointData, Sprite, Text, Texture} from "pixi.js";
import {loadedAssets} from "@front/viewer/assets";
import {getCenterPivot} from "@front/viewer/lib/get-center-pivot";
import {getSelectedEntity, Registry} from "@front/viewer/registry";
import {getDistance} from "@common/lib/getDistance";
import {iconLayer, labelLayer, starLayer, starsContainer} from "@front/viewer/UIElements";

let traitTextures;

export interface UniverseEntityProperties {
  texture: Texture
  traits: string[]
  label?: string,
  scale?: number,
  rotation?: number,
  position: PointData,
  onSelect?: (entity: UniverseEntity) => void,
  onHover?: (entity: UniverseEntity) => void
  onRightClick?: (event: FederatedPointerEvent, entity: UniverseEntity) => void
}

export class UniverseEntity {
  protected starLayerObject = new Container()
  protected iconLayerObject = new Container()
  protected labelLayerObject = new Container()

  __entity = 'universe-object'
  sprite: Sprite
  hoverCircle: Graphics
  text?: Text
  selected: boolean
  scaleFactor = 1

  constructor(properties: UniverseEntityProperties) {
    starLayer.addChild(this.starLayerObject)
    iconLayer.addChild(this.iconLayerObject)
    labelLayer.addChild(this.labelLayerObject)

    this.x = properties.position.x
    this.y = properties.position.y
    this.selected = false;
    this.starLayerObject.cursor = 'pointer'
    this.scaleFactor = properties.scale ?? this.scaleFactor

    this.sprite = new Sprite(properties.texture)
    const pivot = getCenterPivot(properties.texture)
    this.sprite.pivot = pivot

    this.sprite.rotation = properties.rotation ?? 0
    this.sprite.eventMode = 'static'
    this.sprite.scale = {x: this.scaleFactor, y: this.scaleFactor}

    this.starLayerObject.addChild(this.sprite)
    this.addTraits(properties.traits)

    this.hoverCircle = new Graphics();
    this.hoverCircle.circle(0, 0, 48 * this.scaleFactor).stroke({
      color: 0xffffff,
      width: 2,
    })
    this.hoverCircle.zIndex = -1;
    this.hoverCircle.visible = false;
    this.hoverCircle.eventMode = 'none'
    this.labelLayerObject.addChild(this.hoverCircle)

    this.sprite.on('rightclick', (event) => {
      event.stopPropagation()
      console.log(`right click on ${properties.label}`)
      properties.onRightClick?.(event, this)
    });
    this.sprite.on('mouseover', () => {
      this.hoverCircle.visible = true;
      //this.sprite.scale = {x: 1.2*this.scaleFactor, y: 1.2*this.scaleFactor}
      properties.onHover?.(this)
    });
    this.sprite.on('mouseleave', () => {
      if (!this.selected) {
        this.hoverCircle.visible = false;
      }
      this.sprite.scale = {x: this.scaleFactor, y: this.scaleFactor}
    });
    this.sprite.on('click', (event) => {
      console.log(`click on ${properties.label}`)
      event.stopPropagation()
      this.hoverCircle.visible = true;
      this.hoverCircle.tint = 0x00ff00;
      this.selected = true;
      properties.onSelect?.(this)
    })
    if (properties.label) {
      this.text = new Text({
        text: properties.label,
        renderMode: 'bitmap',
        style: {
          fontFamily: 'use_font',
          fill: 0xffffff,
          fontSize: 18,
          align: 'left',
        }
      })
      this.text.name = 'label'
      this.text.x = 0
      this.text.y = 40
      this.text.visible = false;
      this.sprite.on('mouseover', () => {
        if (this.text) {
          this.text.visible = true;
        }
      });
      this.sprite.on('mouseout', () => {
        if (this.text) {
          this.text.visible = false;
        }
      });
      this.labelLayerObject.addChild(this.text)
    }
  }

  set x(x: number) {
    this.starLayerObject.x = x
    this.iconLayerObject.x = x
    this.labelLayerObject.x = x
  }

  set y(y: number) {
    this.starLayerObject.y = y
    this.iconLayerObject.y = y
    this.labelLayerObject.y = y
  }

  set position(position: PointData) {
    this.x = position.x
    this.y = position.y
  }

  get position() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  get x() {
    return this.starLayerObject.x
  }

  get y() {
    return this.starLayerObject.y
  }

  set scale(scale: { x: number; y: number; }) {
    this.starLayerObject.scale = scale
    this.iconLayerObject.scale = scale
    this.labelLayerObject.scale = scale
  }

  public unload() {
    starsContainer.removeChild(this.starLayerObject)
    iconLayer.removeChild(this.iconLayerObject)
    labelLayer.removeChild(this.labelLayerObject)
  }

  public deselect() {
    this.selected = false;
    this.hoverCircle.visible = false;
    this.hoverCircle.tint = 0xffffff;
  }

  public setAngle(rotation: number) {
    this.sprite.rotation = rotation;
  }

  private addTrait(texture: Texture, offset: number) {
    const sprite = new Sprite(texture)
    sprite.pivot = getCenterPivot(texture)
    sprite.scale = {x: 0.25, y: 0.25}
    sprite.x = offset - 16
    sprite.y =  24
    this.iconLayerObject.addChild(sprite)
  }
  private addTraits(traits: string[]) {
    if (!traitTextures) {
      traitTextures = {
        market: loadedAssets.spritesheet.textures['public/textures/market.png'],
        shipyard: loadedAssets.spritesheet.textures['public/textures/shipyard.png'],
        belt: loadedAssets.spritesheet.textures['public/textures/asteroid.png'],
        jumpgate: loadedAssets.spritesheet.textures['public/textures/jumpgate.png'],
        station: loadedAssets.spritesheet.textures['public/textures/station.png'],
        uncharted: loadedAssets.spritesheet.textures['public/textures/treasure.png'],
      }
    }

    let xOffset = 0;
    Object.keys(traitTextures).forEach(trait => {
      if (traits.includes(trait)) {
        try {


          this.addTrait(traitTextures[trait], xOffset)
        } catch (e) {
          console.error(`Error adding trait ${trait} to entity`, e)
        }
        xOffset += 16
      }
    })
  }
}
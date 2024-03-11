import {Container, FederatedPointerEvent, Graphics, PointData, Rectangle, Sprite, Text, Texture} from "pixi.js";
import {loadedAssets} from "@front/viewer/assets";
import {getCenterPivot} from "@front/viewer/lib/get-center-pivot";
import {iconLayer, labelLayer, starLayer, starsContainer} from "@front/viewer/UIElements";

let traitTextures;

export interface UniverseEntityProperties {
  texture: Texture
  traits: string[]
  label?: string,
  scale?: number,
  rotation?: number,
  color?: number,
  tint?: number,
  position: PointData,
  onSelect?: (entity: UniverseEntity) => void,
  onHover?: (entity: UniverseEntity) => void
  onRightClick?: (event: FederatedPointerEvent, entity: UniverseEntity) => void
  spriteLayer: Container
}

export class UniverseEntity {
  protected starLayerObject = new Container()
  protected iconLayerObject = new Container()
  protected labelLayerObject = new Container()

  private spriteLayer: Container

  __entity = 'universe-object'
  shape = 'circle'
  sprite: Sprite
  hoverCircle: Graphics
  simpleItem: Graphics
  text?: Text
  selected: boolean
  scaleFactor = 1

  constructor(private properties: UniverseEntityProperties) {
    this.spriteLayer = properties.spriteLayer ?? starLayer
    this.spriteLayer.addChild(this.starLayerObject)
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
    this.sprite.hitArea = new Rectangle(pivot.x-32, pivot.y-32, 64, 64);

    this.sprite.rotation = properties.rotation ?? 0
    this.sprite.eventMode = 'static'
    this.sprite.visible = true;
    this.sprite.tint = properties.tint ?? undefined
    this.sprite.scale = {x: this.scaleFactor, y: this.scaleFactor}

    this.starLayerObject.addChild(this.sprite)

    this.simpleItem = new Graphics()
    this.simpleItem.circle(0, 0, 32)
    this.simpleItem.fill({
      color: properties.color ?? 0xFF0000
    })
    this.simpleItem.closePath()
    this.simpleItem.scale = {x: this.scaleFactor, y: this.scaleFactor}
    this.simpleItem.visible = false;
    this.starLayerObject.addChild(this.simpleItem)

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
      this.select();
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

  select() {
    this.hoverCircle.visible = true;
    this.hoverCircle.tint = 0x00ff00;
    this.selected = true;
    this.properties.onSelect?.(this)
  }

  set displaySimple(simple: boolean) {
    if (simple) {
      this.sprite.visible = false;
      this.iconLayerObject.visible = false;
      this.simpleItem.visible = true;
    } else {
      this.sprite.visible = true;
      this.iconLayerObject.visible = true;
      this.simpleItem.visible = false;
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
    this.spriteLayer.removeChild(this.starLayerObject)
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
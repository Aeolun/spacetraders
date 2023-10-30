import {Container, Graphics, PointData, Sprite, Text, Texture} from "pixi.js";
import {loadedAssets} from "@front/viewer/assets";
import {getCenterPivot} from "@front/viewer/lib/get-center-pivot";

let traitTextures;

export interface UniverseEntityProperties {
  texture: Texture
  traits: string[]
  label?: string,
  position: PointData,
  onSelect?: () => void,
}

export class UniverseEntity extends Container {
  sprite: Sprite
  hoverCircle: Graphics
  selected: boolean
  scaleFactor = 1

  constructor(properties: UniverseEntityProperties) {
    super();

    this.x = properties.position.x
    this.y = properties.position.y
    this.selected = false;
    this.cursor = 'pointer'

    this.sprite = new Sprite(properties.texture)
    this.interactive = true;
    this.sprite.pivot = getCenterPivot(properties.texture)

    this.addChild(this.sprite)
    this.addTraits(properties.traits)


    this.hoverCircle = new Graphics();
    this.hoverCircle.circle(0, 0, 48).stroke({
      color: 0xffffff,
      width: 2,
    })
    this.hoverCircle.visible = false;
    this.addChild(this.hoverCircle)

    this.on('mouseover', () => {
      this.hoverCircle.visible = true;
      this.sprite.scale = {x: 1.2*this.scaleFactor, y: 1.2*this.scaleFactor}
    });
    this.on('mouseout', () => {
      if (!this.selected) {
        this.hoverCircle.visible = false;
      }
      this.sprite.scale = {x: 1*this.scaleFactor, y: 1*this.scaleFactor}
    });
    this.on('click', (event) => {
      console.log(`click on ${properties.label}`)
      event.stopPropagation()
      this.hoverCircle.visible = true;
      this.hoverCircle.tint = 0x00ff00;
      this.selected = true;
      properties.onSelect?.()
    })
    if (properties.label) {
      const text = new Text({
        text: properties.label,
        renderMode: 'canvas',
        style: {
          fontFamily: 'sans-serif',
          fill: 0xffffff,
          fontSize: 18,
          align: 'left',
        }
      })
      text.name = 'label'
      text.x = 0
      text.y = 40
      text.visible = false;
      this.on('mouseover', () => {
          text.visible = true;
      });
      this.on('mouseout', () => {
          text.visible = false;
      });
      this.addChild(text)
    }
  }

  public deselect() {
    this.selected = false;
    this.hoverCircle.visible = false;
    this.hoverCircle.tint = 0xffffff;
  }

  private addTrait(texture: Texture, offset: number) {
    const sprite = new Sprite(texture)
    sprite.pivot = getCenterPivot(texture)
    sprite.scale = {x: 0.25, y: 0.25}
    sprite.x = offset - 16
    sprite.y =  24
    this.addChild(sprite)
  }
  private addTraits(traits: string[]) {
    if (!traitTextures) {
      traitTextures = {
        market: loadedAssets.market,
        shipyard: loadedAssets.shipyard,
        belt: loadedAssets.asteroidBelt,
        jumpgate: loadedAssets.jumpgate,
        station: loadedAssets.station,
        uncharted: loadedAssets.treasure,
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
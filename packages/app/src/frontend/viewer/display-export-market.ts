import {AnimatedSprite, Container, Graphics, Sprite} from "pixi.js";
import {Registry} from "@front/viewer/registry";
import {starLayer} from "@front/viewer/UIElements";
import {getStarPosition} from "@front/viewer/util";
import {mapScale} from "@front/viewer/consts";
import {loadedAssets} from "@front/viewer/assets";
import {AnimatedTilingSprite} from "@front/viewer/lib/AnimatedTilingSprite";

const marketRoutes: Container[] = []

export function displayExportMarkets(systemSymbol: string, waypointSymbol: string, tradeGoodSymbols: string[]) {
  const selectedWaypointData = Registry.waypointData[waypointSymbol]
  const selectedWaypoint = Registry.waypoints[waypointSymbol]

  Registry.waypointsForSystem[systemSymbol].filter(wp => wp.tradeGoods?.some(tg => tradeGoodSymbols.includes(tg.tradeGoodSymbol) && tg.kind === 'EXPORT')).forEach(exportWaypointData => {
    const exportWaypoint = Registry.waypoints[exportWaypointData.symbol]
    const marketRouteNew = new AnimatedTilingSprite(loadedAssets.tradeArrow)
    marketRouteNew.tint = 0x00FF00
    starLayer.addChild(marketRouteNew)
    marketRouteNew.position = {
      x: exportWaypoint.x,
      y: exportWaypoint.y
    }
    // position anchor in the middle of the end of the sprite
    marketRouteNew.anchor.set(0, 0.5)
    marketRouteNew.zIndex = -2
    // rotation is set to make the arrow point in the right direction
    marketRouteNew.rotation = Math.atan2(selectedWaypoint.y - exportWaypoint.y, selectedWaypoint.x - exportWaypoint.x)
    marketRouteNew.scale  = { x: 1, y: 1}
    // make long enough to reach to the next waypoint
    marketRouteNew.width = Math.sqrt(Math.pow(selectedWaypoint.x - exportWaypoint.x, 2) + Math.pow(selectedWaypoint.y - exportWaypoint.y, 2))
    marketRouteNew.height = 16
    marketRouteNew.play()
    marketRoutes.push(marketRouteNew)

    const exports = exportWaypointData.tradeGoods?.filter(tg => tradeGoodSymbols.includes(tg.tradeGoodSymbol) && tg.kind === 'EXPORT')
    if (exports) {
      exports.forEach((tg, idx) => {
        console.log(`export ${tg.tradeGoodSymbol} from ${exportWaypointData.symbol}`)
        const sprite = new Sprite({
          texture: loadedAssets.spritesheet.textures['public/textures/icons/GOOD_' + tg.tradeGoodSymbol + '.png'],
        })
        sprite.zIndex = -1;
        sprite.anchor.set(0.5)
        // position in between the two waypoints
        const x = (exportWaypoint.x + selectedWaypoint.x) / 2 + (idx * 16)
        const y = (exportWaypoint.y + selectedWaypoint.y) / 2
        sprite.position = {x, y}
        marketRoutes.push(sprite);
        starLayer.addChild(sprite);
      })
    }
  })
}

export function displayImportMarkets(systemSymbol: string, waypointSymbol: string, tradeGoodSymbols: string[]) {
  const selectedWaypointData = Registry.waypointData[waypointSymbol]
  const selectedWaypoint = Registry.waypoints[waypointSymbol]

  Registry.waypointsForSystem[systemSymbol].filter(wp => wp.tradeGoods?.some(tg => tradeGoodSymbols.includes(tg.tradeGoodSymbol) && tg.kind === 'IMPORT')).forEach(importWaypointData => {
    const importWaypoint = Registry.waypoints[importWaypointData.symbol]

    const marketRouteNew = new AnimatedTilingSprite(loadedAssets.tradeArrow)
    marketRouteNew.tint = 0xFF0000
    starLayer.addChild(marketRouteNew)
    marketRouteNew.position = {
      x: selectedWaypoint.x,
      y: selectedWaypoint.y
    }
    marketRouteNew.zIndex = -2
    // position anchor in the middle of the end of the sprite
    marketRouteNew.anchor.set(0, 0.5)
    // rotation is set to make the arrow point to the selected waypoint data
    marketRouteNew.rotation = Math.atan2(importWaypoint.y - selectedWaypoint.y, importWaypoint.x - selectedWaypoint.x)

    marketRouteNew.scale  = { x: 1, y: 1}
    // make long enough to reach to the next waypoint
    marketRouteNew.width = Math.sqrt(Math.pow(selectedWaypoint.x - importWaypoint.x, 2) + Math.pow(selectedWaypoint.y - importWaypoint.y, 2))
    marketRouteNew.height = 16
    marketRouteNew.play()
    marketRoutes.push(marketRouteNew)

    const imports = importWaypointData.tradeGoods?.filter(tg => tradeGoodSymbols.includes(tg.tradeGoodSymbol) && tg.kind === 'IMPORT')
    if (imports) {
      imports.forEach((tg, idx) => {
        console.log(`import ${tg.tradeGoodSymbol} from ${importWaypointData.symbol}`)
        const sprite = new Sprite({
          texture: loadedAssets.spritesheet.textures['public/textures/icons/GOOD_' + tg.tradeGoodSymbol + '.png'],
        })
        sprite.zIndex = -1;
        sprite.anchor.set(0.5)
        // position in between the two waypoints
        const x = (importWaypoint.x + selectedWaypoint.x) / 2 + (idx * 16)
        const y = (importWaypoint.y + selectedWaypoint.y) / 2
        sprite.position = {x, y}
        marketRoutes.push(sprite);
        starLayer.addChild(sprite);
      })
    }
  })
}

export function clearMarketRoutes() {
  marketRoutes.forEach(route => {
    starLayer.removeChild(route)
  })
  marketRoutes.length = 0
}
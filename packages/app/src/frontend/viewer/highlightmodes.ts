import {AlphaFilter, Graphics} from "pixi.js";
import {Registry} from "@front/viewer/registry";
import {convertToDisplayCoordinates} from "@front/viewer/util";
import {scale} from "@front/viewer/consts";


var stringToColour = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

type HighlightMode = 'Factions' | 'Shipyards' | 'Market Update'
export const highlightmodes: Record<HighlightMode, (graphics: Graphics) => void> = {
  Factions: (graphics) => {
    for(const starData of Object.values(Registry.systemData)) {
      if (starData.majorityFaction) {
        const isHeadquarters = Registry.factions[starData.majorityFaction].headquartersSymbol.includes(starData.symbol)
        const displayCoords = convertToDisplayCoordinates(starData)
        graphics.beginFill(stringToColour(starData.majorityFaction))
        graphics.drawCircle(displayCoords.x, displayCoords.y,  isHeadquarters? 4500 : 1500)
      }
    }
    const colorMatrix = new AlphaFilter();
    colorMatrix.alpha = 0.1;
    graphics.filters = [colorMatrix];
  },
  Shipyards: (graphics) => {
    for(const starData of Object.values(Registry.systemData)) {
      if (starData.hasShipyard) {
        const displayCoords = convertToDisplayCoordinates(starData)
        graphics.beginFill(0x0000FF)
        graphics.drawCircle(displayCoords.x, displayCoords.y,  1500)
      }
    }
    const colorMatrix = new AlphaFilter();
    colorMatrix.alpha = 0.1;
    graphics.filters = [colorMatrix];
  },
  'Market Update': (graphics) => {
    for(const shipData of Object.values(Registry.shipData)) {
      if (shipData.currentBehavior === 'EXPLORE_MARKETS' || shipData.currentBehavior === 'UPDATE_MARKETS') {
        const homeSystem = Registry.systemData[shipData.homeSystemSymbol]
        const displayCoords = convertToDisplayCoordinates(homeSystem)
        const range = shipData.behaviorRange * scale.universe
        graphics.beginFill(0x66FF66)
        graphics.drawRect(displayCoords.x-range, displayCoords.y-range,  range*2, range*2)
      }
    }
    const colorMatrix = new AlphaFilter();
    colorMatrix.alpha = 0.1;
    graphics.filters = [colorMatrix];
  }
}
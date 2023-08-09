import {Ship} from "@auto/ship/ship";
import {ShipBehavior} from "@auto/prisma";
import {tradeLogic} from "@auto/ship/behaviors/trade-behavior";
import {mineBehavior} from "@auto/ship/behaviors/mine-behavior";
import {exploreBehavior} from "@auto/ship/behaviors/explore-behavior";
import {updateMarketsBehavior} from "@auto/ship/behaviors/update-markets-behavior";
import {exploreNewMarkets} from "@auto/ship/behaviors/explore-markets-shipyards";
import {mapJumpgatesBehavior} from "@auto/ship/behaviors/map-jumpgates-behavior";
import {BehaviorParameters} from "@auto/ship/shipBehavior";
import {travelBehavior} from "@auto/ship/behaviors/travel-behavior";

export interface ShipLogic {
  symbol: ShipBehavior
  name: string;
  description: string;
  unlisted?: boolean
  logic: (ship: Ship, parameters: BehaviorParameters) => Promise<void>;
}

export const availableLogic: ShipLogic[] = [
  {
    symbol: ShipBehavior.TRADE,
    name: "Trade",
    description: "Trade between stations",
    logic: tradeLogic
  },
  {
    symbol: ShipBehavior.MINE,
    name: "Mine",
    description: "Mine asteroids",
    logic: mineBehavior
  },
  {
    symbol: ShipBehavior.EXPLORE,
    name: "Explore",
    description: "Explore the universe",
    logic: exploreBehavior
  },
  {
    symbol: ShipBehavior.UPDATE_MARKETS,
    name: "Update Markets",
    description: "Update markets",
    logic: updateMarketsBehavior
  },
  {
    symbol: ShipBehavior.EXPLORE_MARKETS,
    name: "Explore Markets",
    description: "Explore new markets",
    logic: exploreNewMarkets
  },
  {
    symbol: ShipBehavior.MAP_JUMPGATE,
    name: "Map jump gates",
    description: "Map jump gates",
    logic: mapJumpgatesBehavior
  },
  {
    symbol: ShipBehavior.TRAVEL,
    name: "Travel",
    description: "Travel to a system",
    unlisted: true,
    logic: async (ship: Ship, parameters: BehaviorParameters) => {
      await travelBehavior(parameters.systemSymbol, ship, undefined)
    }
  }
]
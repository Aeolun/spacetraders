import {Ship} from "@app/ship/ship";
import {ShipBehavior} from "@app/prisma";
import {tradeLogic} from "@app/ship/behaviors/trade-behavior";
import {mineBehavior} from "@app/ship/behaviors/mine-behavior";
import {exploreBehavior} from "@app/ship/behaviors/explore-behavior";
import {updateMarketsBehavior} from "@app/ship/behaviors/update-markets-behavior";
import {exploreNewMarkets} from "@app/ship/behaviors/explore-markets-shipyards";
import {mapJumpgatesBehavior} from "@app/ship/behaviors/map-jumpgates-behavior";
import {BehaviorParamaters} from "@app/ship/shipBehavior";

export interface ShipLogic {
  symbol: ShipBehavior
  name: string;
  description: string;
  logic: (ship: Ship, parameters: BehaviorParamaters) => Promise<void>;
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
  }
]
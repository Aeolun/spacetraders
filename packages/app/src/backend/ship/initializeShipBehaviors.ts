import {prisma, ShipBehavior} from "@app/prisma";
import {tradeLogic} from "@app/ship/behaviors/trade-behavior";
import {mineBehavior} from "@app/ship/behaviors/mine-behavior";
import {exploreBehavior} from "@app/ship/behaviors/explore-behavior";
import {updateMarketsBehavior} from "@app/ship/behaviors/update-markets-behavior";
import {exploreNewMarkets} from "@app/ship/behaviors/explore-markets-shipyards";

export const initializeShipBehaviors = () => {
    prisma.ship.findMany({
        where: {
            NOT: {
                currentBehavior: null
            }
        }
    }).then(ships => {
        ships.forEach(ship => {
            // start behavior
            switch(ship.currentBehavior) {
                case ShipBehavior.TRADE:
                    tradeLogic(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                    break;
                case ShipBehavior.MINE:
                    mineBehavior(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                    break;
                case ShipBehavior.EXPLORE:
                    exploreBehavior(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                    break;
                case ShipBehavior.UPDATE_MARKETS:
                    updateMarketsBehavior(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
                    break;
                case ShipBehavior.EXPLORE_MARKETS:
                    exploreNewMarkets(ship.symbol, ship.homeSystemSymbol, ship.behaviorRange)
            }
        })
    })
}
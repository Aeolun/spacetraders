import {prisma, ShipBehavior} from "@auto/prisma";
import {tradeLogic} from "@auto/ship/behaviors/trade-behavior";
import {mineBehavior} from "@auto/ship/behaviors/mine-behavior";
import {exploreBehavior} from "@auto/ship/behaviors/explore-behavior";
import {updateMarketsBehavior} from "@auto/ship/behaviors/update-markets-behavior";
import {exploreNewMarkets} from "@auto/ship/behaviors/explore-markets-shipyards";
import {mapJumpgatesBehavior} from "@auto/ship/behaviors/map-jumpgates-behavior";
import {travelBehavior} from "@auto/ship/behaviors/travel-behavior";
import {Ship} from "@auto/ship/ship";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {shipBehaviors, startBehaviorForShip} from "@auto/ship/shipBehavior";

export const initializeShipBehaviors = async () => {
    prisma.ship.findMany({
        where: {
            NOT: {
                currentBehavior: null
            }
        }
    }).then(ships => {
        ships.forEach(ship => {
            // start behavior
            startBehaviorForShip(ship.symbol, { systemSymbol: ship.homeSystemSymbol, range: ship.behaviorRange, once: ship.behaviorOnce }, ship.currentBehavior)
        })
    })
}
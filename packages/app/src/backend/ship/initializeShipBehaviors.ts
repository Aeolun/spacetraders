import {prisma, ShipBehavior} from "@app/prisma";
import {tradeLogic} from "@app/ship/behaviors/trade-behavior";
import {mineBehavior} from "@app/ship/behaviors/mine-behavior";
import {exploreBehavior} from "@app/ship/behaviors/explore-behavior";
import {updateMarketsBehavior} from "@app/ship/behaviors/update-markets-behavior";
import {exploreNewMarkets} from "@app/ship/behaviors/explore-markets-shipyards";
import {mapJumpgatesBehavior} from "@app/ship/behaviors/map-jumpgates-behavior";
import {travelBehavior} from "@app/ship/behaviors/travel-behavior";
import {Ship} from "@app/ship/ship";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {shipBehaviors, startBehaviorForShip} from "@app/ship/shipBehavior";

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
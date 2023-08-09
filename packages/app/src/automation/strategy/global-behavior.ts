import {startBehaviorForShip} from "@auto/ship/shipBehavior";
import {prisma, ShipBehavior} from "@auto/prisma";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";

let stage = 0;
export async function initGlobalBehavior() {
  let agent = await getBackgroundAgent()
  let homeSystem = agent.headquarters.system;
  let hasUnexploredHomeWaypoints = await prisma.waypoint.findFirst({
    where: {
      tradeGoods: {
        some: {
          purchasePrice: null
        }
      }
    }
  })

  if (hasUnexploredHomeWaypoints) {
    stage = 1;
  } else {
    stage = 2;
  }

  while(true) {
    console.log(`Running global logic at stage ${stage}`)
    if (stage === 1) {
      await startBehaviorForShip('PHANTASM-1', {
        systemSymbol: homeSystem.symbol
      }, ShipBehavior.EXPLORE_MARKETS)
    } else if (stage === 2) {
      await startBehaviorForShip('PHANTASM-1', {
        systemSymbol: homeSystem.symbol
      }, ShipBehavior.MINE)
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
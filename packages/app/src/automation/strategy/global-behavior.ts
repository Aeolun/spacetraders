import { startBehaviorForShip } from "@auto/ship/shipBehavior";
import { prisma, ShipBehavior } from "@auto/prisma";
import { getBackgroundAgent } from "@auto/lib/get-background-agent";

let stage = 0;
export async function initGlobalBehavior() {
  let agent = await getBackgroundAgent();
  let homeWaypoint = await prisma.waypoint.findFirstOrThrow({
    where: {
      symbol: agent.headquartersSymbol,
    },
    include: {
      system: true,
    },
  });
  let homeSystem = homeWaypoint.system;
  let hasUnexploredHomeWaypoints =
    (
      await prisma.waypoint.findMany({
        where: {
          systemSymbol: homeSystem.symbol,
        },
        include: {
          tradeGoods: true,
        },
      })
    ).filter((w) => w.tradeGoods.length === 0).length > 0;

  if (hasUnexploredHomeWaypoints) {
    stage = 1;
  } else {
    stage = 2;
  }

  while (true) {
    //console.log(`Running global logic at stage ${stage}`);
    if (stage === 1) {
      await startBehaviorForShip(
        "PHANTASM-1",
        {
          systemSymbol: homeSystem.symbol,
        },
        ShipBehavior.EXPLORE
      );
    } else if (stage === 2) {
      await startBehaviorForShip(
        "PHANTASM-1",
        {
          systemSymbol: homeSystem.symbol,
        },
        ShipBehavior.MINE
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

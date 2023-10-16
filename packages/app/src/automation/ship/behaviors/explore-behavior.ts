import { Ship } from "@auto/ship/ship";
import { prisma, Prisma } from "@auto/prisma";
import { storeWaypoint } from "@auto/ship/storeResults";
import { travelBehavior } from "@auto/ship/behaviors/travel-behavior";
import { getDistance } from "@common/lib/getDistance";
import { defaultWayfinder } from "@auto/wayfinding";
import { BehaviorParameters } from "@auto/ship/shipBehavior";
import { checkIfNeedDriftForFuel } from "./atoms/check-if-need-drift-for-fuel";

const exploreTaken = new Set([] as string[]);
const shitList: {
  system: string;
  expire: number;
}[] = [
  {
    system: "garbage",
    expire: Number.MAX_SAFE_INTEGER,
  },
];

export const exploreBehavior = async (
  ship: Ship,
  parameters: BehaviorParameters
) => {
  const system = await prisma.system.findFirstOrThrow({
    where: {
      symbol: parameters.systemSymbol,
    },
  });

  await checkIfNeedDriftForFuel(ship);

  let list: { symbol: string; distance: number; waypointCount: number }[];
  if (ship.hasWarpDrive) {
    list = await prisma.$queryRaw<
      {
        symbol: string;
        distance: number;
        waypointCount: number;
      }[]
    >`
            SELECT s.symbol,
                   MAX(SQRT(POW(s.x - ${ship.currentSystem.x}, 2) + POW(s.y - ${
      ship.currentSystem.y
    }, 2))) as distance,
                   COUNT(wp.symbol)                                                    waypointCount
            FROM Waypoint wp
                     INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'UNCHARTED'
                     INNER JOIN System s ON
                wp.systemSymbol = s.symbol
            WHERE s.x > ${system.x - parameters.range}
              and s.x < ${system.x + parameters.range}
              and s.y > ${system.y - parameters.range}
              and s.y < ${system.y + parameters.range}
              and wp.chartSubmittedBy IS NULL
              and s.symbol NOT IN(${Prisma.join(shitList.map((s) => s.system))})
            GROUP BY s.symbol
            ORDER BY distance ASC;`;
  } else {
    list = await prisma.$queryRaw<
      {
        symbol: string;
        distance: number;
        waypointCount: number;
      }[]
    >`
            SELECT s.symbol,
                   MAX(SQRT(POW(s.x - ${ship.currentSystem.x}, 2) + POW(s.y - ${
      ship.currentSystem.y
    }, 2))) as distance,
                   COUNT(wp.symbol)                                                    waypointCount
            FROM Waypoint wp
                     INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'UNCHARTED'
                     INNER JOIN \`System\` s ON
                wp.systemSymbol = s.symbol
            WHERE s.x > ${system.x - parameters.range}
              and s.x < ${system.x + parameters.range}
              and s.y > ${system.y - parameters.range}
              and s.y < ${system.y + parameters.range}
              and s.hasJumpGate = true
              and wp.chartSubmittedBy IS NULL
              and s.symbol NOT IN(${Prisma.join(shitList.map((s) => s.system))})
            GROUP BY s.symbol
            ORDER BY distance ASC;`;
  }

  ship.log(`Found ${list.length} systems to explore`);

  const explorable = list.filter((system) => {
    return !exploreTaken.has(system.symbol);
  });
  if (explorable.length <= 0) {
    ship.log(
      `No systems to explore within ${parameters.range} of ${parameters.systemSymbol}, waiting.`
    );
    await ship.setOverallGoal(null);
    await ship.waitUntil(new Date(Date.now() + 1000 * 60).toISOString());
    return;
  }

  // try to explore current system first if still available
  let exploreSystem = explorable.find(
    (s) => s.symbol === ship.currentSystemSymbol
  );
  if (!exploreSystem) {
    exploreSystem = explorable[0];
  }
  exploreTaken.add(exploreSystem.symbol);
  await ship.setOverallGoal(`Exploring waypoints in ${exploreSystem.symbol}`);

  ship.log(`Check if ${exploreSystem.symbol} is still uncharted`);

  const systemInfo = await ship.queue(() =>
    ship.api.systems.getSystemWaypoints(exploreSystem.symbol, 1, 20)
  );
  systemInfo.data.data.forEach((wp) => {
    storeWaypoint(wp);
  });

  const hasUnchartedTraits = systemInfo.data.data.some((wp) => {
    return wp.traits.some((trait) => trait.symbol === "UNCHARTED");
  });
  if (!hasUnchartedTraits) {
    ship.log(
      `${exploreSystem.symbol} has no more uncharted waypoints, continuing with next system.`
    );
    await prisma.system.update({
      where: {
        symbol: exploreSystem.symbol,
      },
      data: {
        hasUncharted: false,
      },
    });
    await ship.setOverallGoal(null);
    return;
  }

  let explorableWaypoints = (await prisma.waypoint.findMany({
    where: {
      systemSymbol: exploreSystem.symbol,
      traits: {
        some: {
          symbol: "UNCHARTED",
        },
      },
    },
  })).map(i => ({
    ...i,
    distance: undefined
  }));

  const success = await travelBehavior(
    exploreSystem.symbol,
    ship,
    explorableWaypoints[0].symbol
  );
  if (!success) {
    // cannot find a route or travel to this system
    ship.log(
      `Couldn't find a route to ${exploreSystem.symbol}, putting it on the shitlist for an hour.`
    );
    shitList.push({
      system: exploreSystem.symbol,
      expire: Date.now() + 3600 * 1000,
    });
    return;
  }

  ship.log(
    `Arrived at ${exploreSystem.symbol} for charting ${exploreSystem.waypointCount} waypoints.`
  );

  do {
    const shipData = await prisma.ship.findFirstOrThrow({
      where: {
        symbol: ship.symbol,
      },
      include: {
        currentWaypoint: true,
      },
    });
    explorableWaypoints.forEach((wp) => {
      wp.distance = getDistance(wp, shipData.currentWaypoint);
    });
    explorableWaypoints.sort((a, b) => {
      return a.distance > b.distance ? 1 : -1;
    });

    // closest waypoint
    const wp = explorableWaypoints[0];

    await ship.navigate(wp.symbol);
    const chartResult = await ship.chart();

    const hasShipyard = chartResult.waypoint.traits.some(
      (t) => t.symbol === "SHIPYARD"
    );
    const hasMarketplace = chartResult.waypoint.traits.some(
      (t) => t.symbol === "MARKETPLACE"
    );
    if (hasMarketplace || hasShipyard) {
      await ship.dock();
      if (hasMarketplace) {
        await ship.market();
        await ship.attemptRefuel();
      }
      if (hasShipyard) {
        await ship.shipyard();
      }
      await ship.orbit();
    }

    if (chartResult.waypoint.type === "JUMP_GATE") {
      await ship.jumpgate();
      await defaultWayfinder.loadWaypoints();
    }

    explorableWaypoints = (await prisma.waypoint.findMany({
      where: {
        systemSymbol: exploreSystem.symbol,
        traits: {
          some: {
            symbol: "UNCHARTED",
          },
        },
      },
    })).map(i => ({
      ...i,
      distance: undefined
    }));
  } while (explorableWaypoints.length > 0);

  ship.log(`Finished exploring ${exploreSystem.symbol}`);
  exploreTaken.delete(exploreSystem.symbol);
  await ship.setOverallGoal(null);
};

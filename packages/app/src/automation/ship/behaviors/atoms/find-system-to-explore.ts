import {Prisma, prisma} from "@auto/prisma";
import {Ship} from "@auto/ship/ship";

export const findSystemToExplore = async (ship: Ship) => {
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
            WHERE wp.chartSubmittedBy IS NULL
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
            WHERE s.hasJumpGate = true
              and wp.chartSubmittedBy IS NULL
            GROUP BY s.symbol
            ORDER BY distance ASC;`;
  }
  ship.log(`Found ${list.length} systems to explore`);

  return list[0];
}
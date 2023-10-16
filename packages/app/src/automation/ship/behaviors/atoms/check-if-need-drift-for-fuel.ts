import { prisma } from "@auto/prisma";
import { Ship } from "@auto/ship/ship";

export async function checkIfNeedDriftForFuel(ship: Ship) {
  // go find a place to refuel if low, and we have fuel in the first place
  if (ship.maxFuel > 0 && (ship.fuel < 50 || ship.fuel < ship.maxFuel / 4)) {
    await ship.setOverallGoal("Refueling because low on fuel");
    await ship.navigateMode("DRIFT");

    const clostestFuel = await prisma.$queryRaw<
      { waypointSymbol: string; systemSymbol: string }[]
    >`SELECT mp.* ,s.symbol systemSymbol, SQRT(POW(s.x - ${ship.currentSystem.x}, 2) + POW(s.y - ${ship.currentSystem.y}, 2)) as distance  FROM MarketPrice mp INNER JOIN \`Waypoint\` wp on wp.symbol  = mp.waypointSymbol INNER JOIN \`System\` s ON s.symbol = wp.systemSymbol  WHERE mp.tradeGoodSymbol  = 'FUEL' ORDER BY distance ASC LIMIT 10`;
    if (clostestFuel[0].systemSymbol !== ship.currentSystemSymbol) {
      await ship.warp(clostestFuel[0]["waypointSymbol"]);
    } else {
      await ship.navigate(clostestFuel[0]["waypointSymbol"]);
    }
    await ship.dock();
    await ship.refuel();
    return;
  }
}

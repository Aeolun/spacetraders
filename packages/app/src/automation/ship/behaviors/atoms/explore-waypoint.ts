import {Ship} from "@auto/ship/ship";
import {defaultWayfinder} from "@common/default-wayfinder";

export async function exploreWaypoint(ship: Ship) {
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
    await defaultWayfinder.addSystemFromDatabase(ship.currentSystem.symbol);
  }
}
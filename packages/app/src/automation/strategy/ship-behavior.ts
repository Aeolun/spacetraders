import {prisma} from "@common/prisma";
import {Ship} from "@auto/ship/ship";
import {APIInstance} from "@auto/lib/createApi";
import {Orchestrator} from "@auto/strategy/orchestrator";

export const startShipBehavior = async (orchestrator: Orchestrator, api: APIInstance) => {
  const ships = await prisma.ship.findMany({
    where: {
      agent: process.env.AGENT_NAME
    }
  });

  for (const shipData of ships) {
    const ship = new Ship(shipData.symbol, api)

    orchestrator.addShip(ship)
  }
}
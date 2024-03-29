import {prisma} from "@common/prisma";
import {Ship} from "@auto/ship/ship";
import createApi, {APIInstance} from "@common/lib/createApi";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {getAllShips} from "@auto/ship/getAllShips";

export const startShipBehavior = async (orchestrator: Orchestrator, api: APIInstance) => {
  const start = Date.now()

  const allShips = await getAllShips(api)

  const ships = await prisma.ship.findMany({
    where: {
      agent: process.env.AGENT_NAME
    }
  });

  console.log("loading data for ships", allShips.length)
  for (const shipData of ships) {
    if (!orchestrator.hasExecutor(shipData.symbol)) {

      const ship = new Ship(shipData.symbol, api)
      const existingData = allShips.find(s => s.symbol === shipData.symbol)

      await ship.updateShipStatus(existingData)

      await prisma.ship.update({
        where: {
          symbol: ship.symbol
        },
        data: {
          cargoState: "MANAGED"
        }
      })

      orchestrator.addExecutor(ship).catch(error => {
        ship.log(`Error during orchestration, stopping processing for ship: ${error.message}`, "ERROR")
      })
    } else {
      //console.log("Ship already orchestrated", shipData.symbol)
    }
  }

  console.log(`========= ALL SHIPS ORCHESTRATED in ${Math.round((Date.now() - start)*1000)/1000}ms =========`)
}
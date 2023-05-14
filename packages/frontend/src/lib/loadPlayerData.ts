import {trpc} from "@app/lib/trpc";
import {GameState, ShipData} from "@app/lib/game-state";

export async function loadPlayerData() {
  const ships = await trpc.getMyShips.query()

  ships.forEach(ship => {
    GameState.myShips[ship.symbol] = {
      shipData: ship as ShipData,
      container: undefined
    }
  })
}
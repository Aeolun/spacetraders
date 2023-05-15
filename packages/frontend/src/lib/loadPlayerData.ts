import {trpc} from "@app/lib/trpc";
import {GameState, ShipData} from "@app/lib/game-state";
import {credits} from "@app/lib/UIElements";

export async function loadPlayerData() {
  const ships = await trpc.getMyShips.query()

  console.log('my ships', ships)
  ships.forEach(ship => {
    GameState.myShips[ship.symbol] = {
      shipData: ship as ShipData,
      container: undefined
    }
  })

  await updateCredits()
}

export async function updateCredits() {
  const agent = await trpc.getAgentInfo.query()
  credits.text = `Credits: ${agent.credits}`
}
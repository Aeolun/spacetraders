import {trpc} from "@front/lib/trpc";
import {GameState, ShipData} from "@front/lib/game-state";
import {credits} from "@front/lib/UIElements";

export async function loadPlayerData() {
  const ships = await trpc.getMyShips.query()

  console.log('my ships', ships)
  ships.forEach(ship => {
    GameState.shipData[ship.symbol] = ship
  })

  await updateCredits()
}

export async function updateCredits() {
  const agent = await trpc.getAgentInfo.query()
  credits.text = `${agent.credits}`
}
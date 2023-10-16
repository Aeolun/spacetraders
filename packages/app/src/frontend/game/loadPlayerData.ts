import {trpc} from "@front/trpc";
import {GameState, ShipData} from "@front/game/game-state";

export async function loadPlayerData() {
  await trpc.updateAgentInfo.mutate();
  const ships = await trpc.getMyShips.query()

  console.log('my ships', ships)
  ships.forEach(ship => {
    GameState.shipData[ship.symbol] = ship
  })

  await updateCredits()

  const factions = await trpc.getFactions.query()
  GameState.factions = {}
  factions.forEach(faction => {
    GameState.factions[faction.symbol] = faction
  })
}

export async function updateCredits() {
  const agent = await trpc.getAgentInfo.query()
  GameState.agent = agent
}
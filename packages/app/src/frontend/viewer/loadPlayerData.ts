import {trpc} from "@front/trpc";
import {Registry, ShipData} from "@front/viewer/registry";

export async function loadPlayerData() {
  const ships = await trpc.getMyShips.query()

  console.log('my ships', ships)
  ships.forEach(ship => {
    Registry.shipData[ship.symbol] = ship
  })

  await updateCredits()

  const factions = await trpc.getFactions.query()
  Registry.factions = {}
  factions.forEach(faction => {
    Registry.factions[faction.symbol] = faction
  })
}

export async function updateCredits() {
  const agent = await trpc.getAgentInfo.query()
  Registry.agent = agent
}
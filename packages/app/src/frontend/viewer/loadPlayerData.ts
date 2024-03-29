import {trpc} from "@front/trpc";
import {Registry, ShipData} from "@front/viewer/registry";
import {agentActions} from "@front/ui/slices/agent";
import {store} from "@front/ui/store";
import {shipActions} from "@front/ui/slices/ship";
import {goodsActions} from "@front/ui/slices/goods";

export async function loadPlayerData() {
  const ships = await trpc.getMyShips.query()

  console.log('my ships', ships)
  ships.forEach(ship => {
    Registry.shipData[ship.symbol] = ship
    store.dispatch(shipActions.setShipInfo(ship))
  })

  await updateCredits()

  const factions = await trpc.getFactions.query()
  Registry.factions = {}
  factions.forEach(faction => {
    Registry.factions[faction.symbol] = faction
  })

  const goods = await trpc.consolidatedPrices.query()
  store.dispatch(goodsActions.setGoods(goods))
}

export async function updateCredits() {
  const agent = await trpc.getAgentInfo.query()
  if (agent?.credits) {
    Registry.agent = agent
    store.dispatch(agentActions.setCredits(agent.credits));
    store.dispatch(agentActions.setHeadquarters(agent.headquartersSymbol));
  }
}
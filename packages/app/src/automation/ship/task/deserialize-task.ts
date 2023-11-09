import { ShipTask } from "@common/prisma";
import {Task} from "@auto/ship/task/task";
import {ExploreTask} from "@auto/ship/task/explore";
import {TravelTask} from "@auto/ship/task/travel";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {SellTask} from "@auto/ship/task/sell";
import {UpdateMarketTask} from "@auto/ship/task/update-market";
import {PurchaseShipTask} from "@auto/ship/task/purchase-ship";

export const deserializeTask = (serializedTask: ShipTask): Task => {
  if (serializedTask.type === 'TRAVEL') {
    const data = JSON.parse(serializedTask.data)
    return new TravelTask(data.destination);
  } else if (serializedTask.type === 'EXPLORE') {
    const data = JSON.parse(serializedTask.data)
    return new ExploreTask(data.waypointSymbol);
  } else if (serializedTask.type === 'PURCHASE') {
    const data = JSON.parse(serializedTask.data)
    return new PurchaseTask(data.destination, data.tradeSymbol, data.units);
  } else if (serializedTask.type === 'SELL') {
    const data = JSON.parse(serializedTask.data)
    return new SellTask(data.destination, data.tradeSymbol, data.units);
  } else if (serializedTask.type === 'UPDATE_MARKET') {
    const data = JSON.parse(serializedTask.data)
    return new UpdateMarketTask(data.waypointSymbol);
  } else if (serializedTask.type === 'PURCHASE_SHIP') {
    const data = JSON.parse(serializedTask.data)
    return new PurchaseShipTask({
      waypointSymbol: data.waypointSymbol, shipSymbol: data.shipSymbol, amount: data.amount});
  }
  throw new Error(`Trying to deserialize unknown task type ${serializedTask.type}`)
}
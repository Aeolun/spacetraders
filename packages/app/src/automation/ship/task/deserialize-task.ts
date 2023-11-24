import { ShipTask } from "@common/prisma";
import {Task} from "@auto/ship/task/task";
import {ExploreTask} from "@auto/ship/task/explore";
import {TravelTask} from "@auto/ship/task/travel";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {SellTask} from "@auto/ship/task/sell";
import {UpdateMarketTask} from "@auto/ship/task/update-market";
import {PurchaseShipTask} from "@auto/ship/task/purchase-ship";
import {MineTask} from "@auto/ship/task/mine";
import {OffloadInventoryTask} from "@auto/ship/task/offload-inventory-task";
import {PickupCargoTask} from "@auto/ship/task/pickup-cargo";
import {SiphonTask} from "@auto/ship/task/siphon";
import {SurveyTask} from "@auto/ship/task/survey";

export const deserializeTask = (serializedTask: ShipTask): Task => {
  if (serializedTask.type === 'TRAVEL') {
    const data = JSON.parse(serializedTask.data)
    return new TravelTask(data.destination);
  } else if (serializedTask.type === 'EXPLORE') {
    const data = JSON.parse(serializedTask.data)
    return new ExploreTask(data.waypointSymbol);
  } else if (serializedTask.type === 'PURCHASE') {
    const data = JSON.parse(serializedTask.data)
    return new PurchaseTask(data.destination, data.tradeSymbol, data.units, data.maxPrice);
  } else if (serializedTask.type === 'SELL') {
    const data = JSON.parse(serializedTask.data)
    return new SellTask(data.destination, data.tradeSymbol, data.units, data.minSell);
  } else if (serializedTask.type === 'UPDATE_MARKET') {
    const data = JSON.parse(serializedTask.data)
    return new UpdateMarketTask(data.waypointSymbol);
  } else if (serializedTask.type === 'PURCHASE_SHIP') {
    const data = JSON.parse(serializedTask.data)
    return new PurchaseShipTask({
      waypointSymbol: data.waypointSymbol, shipSymbol: data.shipSymbol, amount: data.amount});
  } else if (serializedTask.type === 'MINE') {
    const data = JSON.parse(serializedTask.data)
    return new MineTask(data.destination, data.units);
  } else if (serializedTask.type === 'OFFLOAD_INVENTORY') {
    return new OffloadInventoryTask();
  } else if (serializedTask.type === "PICKUP_CARGO") {
    const data = JSON.parse(serializedTask.data)
    return new PickupCargoTask(data.waypointSymbol, data.tradeGoods, data.waitForFullCargo);
  } else if (serializedTask.type === "SIPHON") {
    const data = JSON.parse(serializedTask.data)
    return new SiphonTask(data.destination, data.units);
  } else if (serializedTask.type === "SURVEY") {
    const data = JSON.parse(serializedTask.data)
    return new SurveyTask(data.destination, data.count);
  }
  throw new Error(`Trying to deserialize unknown task type ${serializedTask.type}`)
}
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
import {ConstructTask} from "@auto/ship/task/construct";

export const deserializeTask = (serializedTask: ShipTask): Task => {
  if (serializedTask.type === 'TRAVEL') {
    const data = JSON.parse(serializedTask.data)
    return new TravelTask(data.destination, data.travelMethod, data.expectedDuration);
  }
  if (serializedTask.type === 'EXPLORE') {
    const data = JSON.parse(serializedTask.data)
    return new ExploreTask({
      expectedPosition: data.expectedPosition,
      expectedDuration: data.expectedDuration
    });
  }
  if (serializedTask.type === 'PURCHASE') {
    const data = JSON.parse(serializedTask.data)
    return new PurchaseTask(data.expectedPosition, data.tradeSymbol, data.units, data.maxPrice);
  }
  if (serializedTask.type === 'SELL') {
    const data = JSON.parse(serializedTask.data)
    return new SellTask(data.expectedPosition, data.tradeSymbol, data.units, data.minSell);
  }
  if (serializedTask.type === 'UPDATE_MARKET') {
    const data = JSON.parse(serializedTask.data)
    return new UpdateMarketTask(data.expectedPosition);
  }
  if (serializedTask.type === 'PURCHASE_SHIP') {
    const data = JSON.parse(serializedTask.data)
    return new PurchaseShipTask({
      expectedPosition: data.expectedPosition, shipSymbol: data.shipSymbol, amount: data.amount});
  }
  if (serializedTask.type === 'MINE') {
    const data = JSON.parse(serializedTask.data)
    return new MineTask(data.expectedPosition, data.units);
  }
  if (serializedTask.type === 'OFFLOAD_INVENTORY') {
    const data = JSON.parse(serializedTask.data)
    return new OffloadInventoryTask(data.expectedPosition);
  }
  if (serializedTask.type === "PICKUP_CARGO") {
    const data = JSON.parse(serializedTask.data)
    return new PickupCargoTask(data.expectedPosition, data.tradeGoods, data.waitForFullCargo);
  }
  if (serializedTask.type === "SIPHON") {
    const data = JSON.parse(serializedTask.data)
    return new SiphonTask(data.expectedPosition, data.units);
  }
  if (serializedTask.type === "SURVEY") {
    const data = JSON.parse(serializedTask.data)
    return new SurveyTask(data.expectedPosition, data.count);
  }
  if (serializedTask.type === "CONSTRUCT") {
    const data = JSON.parse(serializedTask.data)
    return new ConstructTask(data.destination, data.tradeSymbol, data.units);
  }
  throw new Error(`Trying to deserialize unknown task type ${serializedTask.type}`)
}
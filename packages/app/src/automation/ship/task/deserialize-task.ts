import { ShipTask } from "@common/prisma";
import {Task} from "@auto/ship/task/task";
import {explorePayloadSchema, ExploreTask} from "@auto/ship/task/explore";
import {travelPayloadSchema, TravelTask} from "@auto/ship/task/travel";
import {purchasePayloadSchema, PurchaseTask} from "@auto/ship/task/purchase";
import {sellPayloadSchema, SellTask} from "@auto/ship/task/sell";
import {updateMarketPayloadSchema, UpdateMarketTask} from "@auto/ship/task/update-market";
import {purchaseShipPayloadSchema, PurchaseShipTask} from "@auto/ship/task/purchase-ship";
import {minePayloadSchema, MineTask} from "@auto/ship/task/mine";
import {offloadInventoryPayloadSchema, OffloadInventoryTask} from "@auto/ship/task/offload-inventory-task";
import {pickupCargoPayloadSchema, PickupCargoTask} from "@auto/ship/task/pickup-cargo";
import {siphonPayloadSchema, SiphonTask} from "@auto/ship/task/siphon";
import {surveyPayloadSchema, SurveyTask} from "@auto/ship/task/survey";
import {constructPayloadSchema, ConstructTask} from "@auto/ship/task/construct";


export const deserializeTask = (serializedTask: ShipTask): Task => {
  if (serializedTask.type === 'TRAVEL') {
    const data = travelPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new TravelTask(data.destination, data.travelMethod, data.expectedDuration);
  }
  if (serializedTask.type === 'EXPLORE') {
    const data = explorePayloadSchema.parse(JSON.parse(serializedTask.data))
    return new ExploreTask({
      expectedPosition: data.expectedPosition,
      expectedDuration: data.expectedDuration
    });
  }
  if (serializedTask.type === 'PURCHASE') {
    const data = purchasePayloadSchema.parse(JSON.parse(serializedTask.data))
    return new PurchaseTask(data.expectedPosition, data.tradeSymbol, data.units, data.maxPrice);
  }
  if (serializedTask.type === 'SELL') {
    const data = sellPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new SellTask(data.expectedPosition, data.tradeSymbol, data.units, data.minSell);
  }
  if (serializedTask.type === 'UPDATE_MARKET') {
    const data = updateMarketPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new UpdateMarketTask(data.expectedPosition);
  }
  if (serializedTask.type === 'PURCHASE_SHIP') {
    const data = purchaseShipPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new PurchaseShipTask({
      expectedPosition: data.expectedPosition, shipSymbol: data.shipSymbol, amount: data.amount});
  }
  if (serializedTask.type === 'MINE') {
    const data = minePayloadSchema.parse(JSON.parse(serializedTask.data))
    return new MineTask(data.expectedPosition, data.units);
  }
  if (serializedTask.type === 'OFFLOAD_INVENTORY') {
    const data = offloadInventoryPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new OffloadInventoryTask(data);
  }
  if (serializedTask.type === "PICKUP_CARGO") {
    const data = pickupCargoPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new PickupCargoTask(data.expectedPosition, data.tradeGoods, data.waitForFullCargo);
  }
  if (serializedTask.type === "SIPHON") {
    const data = siphonPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new SiphonTask(data.expectedPosition, data.units);
  }
  if (serializedTask.type === "SURVEY") {
    const data = surveyPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new SurveyTask(data.expectedPosition, data.count);
  }
  if (serializedTask.type === "CONSTRUCT") {
    const data = constructPayloadSchema.parse(JSON.parse(serializedTask.data))
    return new ConstructTask(data.destination, data.tradeSymbol, data.units);
  }
  throw new Error(`Trying to deserialize unknown task type ${serializedTask.type}`)
}
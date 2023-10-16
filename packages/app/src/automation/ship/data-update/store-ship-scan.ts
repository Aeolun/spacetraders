import {CreateShipShipScan201ResponseData} from "spacetraders-sdk";

import {processShip} from "@auto/ship/data-update/store-ship";

export async function storeShipScan(data: CreateShipShipScan201ResponseData) {
  await Promise.all(data.ships.map(async ship => {
    return processShip(ship)
  }))
}
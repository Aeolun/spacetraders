import {ShipCargo} from "spacetraders-sdk";
import {prisma} from "@common/prisma";
import {returnShipData} from "@auto/ship/getAllShips";

export async function processCargo(shipSymbol: string, cargo: ShipCargo) {
  await prisma.ship.update({
    where: {
      symbol: shipSymbol,
    },
    data: {
      cargoUsed: cargo.units,
      cargoCapacity: cargo.capacity,
    },
  });
  // remove existing cargo
  await prisma.shipCargo.deleteMany({
    where: {
      shipSymbol: shipSymbol,
    },
  });
  // create a new entry for every cargo item
  for (const c of cargo.inventory) {
    await prisma.tradeGood.upsert({
      where: {
        symbol: c.symbol,
      },
      create: {
        name: c.name,
        symbol: c.symbol,
        description: c.description,
      },
      update: {
        name: c.name,
        description: c.description,
      },
    });
    await prisma.shipCargo.create({
      data: {
        shipSymbol: shipSymbol,
        tradeGoodSymbol: c.symbol,
        units: c.units,
      },
    });
  }

  return returnShipData(shipSymbol);
}
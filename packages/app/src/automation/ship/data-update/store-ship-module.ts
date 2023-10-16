import {ShipModule} from "spacetraders-sdk";
import {prisma} from "@auto/prisma";

export async function storeShipModule(module: ShipModule) {
  const smsplit = module.symbol.split("_");
  const moduleData = {
    name: module.name,
    description: module.description,

    effectName: smsplit.slice(1, smsplit.length - 1).join("_"),
    value: module.range ?? module.capacity,

    crewRequirement: module.requirements.crew,
    powerRequirement: module.requirements.power,
    slotRequirement: module.requirements.slots,
  };
  await prisma.shipModule.upsert({
    where: {
      symbol: module.symbol,
    },
    create: {
      symbol: module.symbol,
      ...moduleData,
    },
    update: moduleData,
  });
}
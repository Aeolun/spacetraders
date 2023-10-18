import {ScannedShipMountsInner, ShipMount} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function storeShipMount(module: ShipMount | ScannedShipMountsInner) {
  const smsplit = module.symbol.split("_");
  const mountData =
    "name" in module
      ? {
        name: module.name,
        description: module.description,

        effectName: smsplit.slice(1, smsplit.length - 1).join("_"),
        value: module.strength,
        worksOn: module.deposits?.join(","),

        crewRequirement: module.requirements.crew,
        powerRequirement: module.requirements.power,
        slotRequirement: module.requirements.slots,
      }
      : {
        name: module.symbol,
        description: module.symbol,
      };
  await prisma.shipMount.upsert({
    where: {
      symbol: module.symbol,
    },
    create: {
      symbol: module.symbol,
      ...mountData,
    },
    update: mountData,
  });
}
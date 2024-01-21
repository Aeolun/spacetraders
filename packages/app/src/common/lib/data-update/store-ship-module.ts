import {ShipModule} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

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
  console.log("selecting")
  const existingModule = await prisma.shipModule.findUnique({
    where: {
      symbol: module.symbol,
    },
  });
  console.log("select over")

  if (!existingModule) {
    console.log('inserting')
    await prisma.shipModule.create({
      data: {
        symbol: module.symbol,
        ...moduleData,
      }
    });
  }
}
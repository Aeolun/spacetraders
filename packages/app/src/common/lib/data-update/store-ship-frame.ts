import {ScannedShipFrame, ShipFrame} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

export async function processShipFrame(frame: ShipFrame | ScannedShipFrame) {
  const frameData =
    "name" in frame
      ? {
        name: frame.name,
        description: frame.description,

        moduleSlots: frame.moduleSlots,
        mountingPoints: frame.mountingPoints,
        fuelCapacity: frame.fuelCapacity,

        crewRequirement: frame.requirements.crew,
        powerRequirement: frame.requirements.power,
      }
      : {
        name: frame.symbol,
        description: frame.symbol,
      };

  return prisma.shipFrame.upsert({
    where: {
      symbol: frame.symbol,
    },
    create: {
      symbol: frame.symbol,
      ...frameData,
    },
    update: frameData,
  });
}
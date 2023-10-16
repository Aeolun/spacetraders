import {ScannedShipEngine, ShipEngine} from "spacetraders-sdk";
import {prisma} from "@auto/prisma";

export async function storeShipEngine(
  engine: ShipEngine | ScannedShipEngine
) {
  const engineData =
    "name" in engine
      ? {
        name: engine.name,
        description: engine.description,

        speed: engine.speed,

        crewRequirement: engine.requirements.crew,
        powerRequirement: engine.requirements.power,
      }
      : {
        name: engine.symbol,
        description: engine.symbol,
      };

  return prisma.shipEngine.upsert({
    where: {
      symbol: engine.symbol,
    },
    create: {
      symbol: engine.symbol,
      ...engineData,
    },
    update: engineData,
  });
}
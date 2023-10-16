import {ScannedShipReactor, ShipReactor} from "spacetraders-sdk";
import {prisma} from "@auto/prisma";

export async function storeShipReactor(
  reactor: ShipReactor | ScannedShipReactor
) {
  const reactorData =
    "name" in reactor
      ? {
        name: reactor.name,
        description: reactor.description,

        powerOutput: reactor.powerOutput,

        crewRequirement: reactor.requirements.crew,
      }
      : {
        name: reactor.symbol,
        description: reactor.symbol,
      };

  return prisma.shipReactor.upsert({
    where: {
      symbol: reactor.symbol,
    },
    create: {
      symbol: reactor.symbol,
      ...reactorData,
    },
    update: reactorData,
  });
}
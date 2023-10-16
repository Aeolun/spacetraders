import {Shipyard} from "spacetraders-sdk";
import {prisma} from "@auto/prisma";
import {storeShipModule} from "@auto/ship/data-update/store-ship-module";
import {storeShipMount} from "@auto/ship/data-update/store-ship-mount";
import {processShipFrame} from "@auto/ship/data-update/store-ship-frame";
import {storeShipEngine} from "@auto/ship/data-update/store-ship-engine";
import {storeShipReactor} from "@auto/ship/data-update/update-ship-reactor";

export async function processShipyard(data: Shipyard) {
  if (data.ships) {
    return Promise.all(data.ships.map(async ship => {
      await prisma.$transaction(async () => {
        await prisma.shipConfiguration.upsert({
          where: {
            symbol: ship.type,
          },
          create: {
            symbol: ship.type,

            name: ship.name,
            description: ship.description,

            frameSymbol: ship.frame.symbol,
            engineSymbol: ship.engine.symbol,
            reactorSymbol: ship.reactor.symbol,
          },
          update: {
            name: ship.name,
            description: ship.description,

            frameSymbol: ship.frame.symbol,
            engineSymbol: ship.engine.symbol,
            reactorSymbol: ship.reactor.symbol,
          }
        })
        await storeShipEngine(ship.engine)
        await processShipFrame(ship.frame)
        await storeShipReactor(ship.reactor)
        for (const module of ship.modules) {
          await storeShipModule(module)
        }
        for (const mount of ship.mounts) {
          await storeShipMount(mount)
        }
        await prisma.shipConfigurationModule.deleteMany({
          where: {
            shipConfigurationSymbol: ship.type
          }
        })
        await prisma.shipConfigurationModule.createMany({
          data: ship.modules.map(module => {
            return {
              shipConfigurationSymbol: ship.type,
              moduleSymbol: module.symbol
            }
          })
        })
        await prisma.shipConfigurationMount.deleteMany({
          where: {
            shipConfigurationSymbol: ship.type
          }
        })
        await prisma.shipConfigurationMount.createMany({
          data: ship.mounts.map(module => {
            return {
              shipConfigurationSymbol: ship.type,
              mountSymbol: module.symbol
            }
          })
        })
        await prisma.shipyardModel.upsert({
          where: {
            shipConfigurationSymbol_waypointSymbol: {
              shipConfigurationSymbol: ship.type,
              waypointSymbol: data.symbol,
            }
          },
          create: {
            shipConfigurationSymbol: ship.type,
            waypointSymbol: data.symbol,
            price: ship.purchasePrice
          },
          update: {
            price: ship.purchasePrice
          }
        })
      })
    }))
  } else if (data.shipTypes) {
    return Promise.all(data.shipTypes.map(async ship => {
      await prisma.shipyardModel.upsert({
        where: {
          shipConfigurationSymbol_waypointSymbol: {
            shipConfigurationSymbol: ship.type,
            waypointSymbol: data.symbol,
          }
        },
        create: {
          shipConfigurationSymbol: ship.type,
          waypointSymbol: data.symbol,
        },
        update: {}
      })
    }))
  } else {
    return Promise.resolve([])
  }
}
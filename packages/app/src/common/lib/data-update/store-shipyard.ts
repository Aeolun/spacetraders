import {Shipyard} from "spacetraders-sdk";
import {prisma} from "@common/prisma";
import {storeShipModule} from "@common/lib/data-update/store-ship-module";
import {storeShipMount} from "@common/lib/data-update/store-ship-mount";
import {processShipFrame} from "@common/lib/data-update/store-ship-frame";
import {storeShipEngine} from "@common/lib/data-update/store-ship-engine";
import {storeShipReactor} from "@common/lib/data-update/store-ship-reactor";

export async function processShipyard(data: Shipyard) {
  if (data.ships) {
    return Promise.all(data.ships.map(async ship => {
      await prisma.$transaction(async () => {
        const configurationSymbol = ship.type
        if (!configurationSymbol) {
          throw new Error("No ship type")
        }
        await prisma.shipConfiguration.upsert({
          where: {
            symbol: configurationSymbol,
          },
          create: {
            symbol: configurationSymbol,

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
              shipConfigurationSymbol: configurationSymbol,
              moduleSymbol: module.symbol
            }
          })
        })
        await prisma.shipConfigurationMount.deleteMany({
          where: {
            shipConfigurationSymbol: configurationSymbol
          }
        })
        await prisma.shipConfigurationMount.createMany({
          data: ship.mounts.map(module => {
            return {
              shipConfigurationSymbol: configurationSymbol,
              mountSymbol: module.symbol
            }
          })
        })
        await prisma.shipyardModel.upsert({
          where: {
            shipConfigurationSymbol_waypointSymbol: {
              shipConfigurationSymbol: configurationSymbol,
              waypointSymbol: data.symbol,
            }
          },
          create: {
            shipConfigurationSymbol: configurationSymbol,
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
      if (ship.type) {
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
      }
    }))
  } else {
    return Promise.resolve([])
  }
}
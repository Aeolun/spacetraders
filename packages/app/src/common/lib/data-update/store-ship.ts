import {ScannedShip, Ship} from "spacetraders-sdk";
import {storeShipModule} from "@common/lib/data-update/store-ship-module";
import {storeShipMount} from "@common/lib/data-update/store-ship-mount";
import {processShipFrame} from "@common/lib/data-update/store-ship-frame";
import {storeShipEngine} from "@common/lib/data-update/store-ship-engine";
import {prisma} from "@common/prisma";

import {processCargo} from "@common/lib/data-update/store-ship-cargo";
import {storeShipReactor} from "@common/lib/data-update/store-ship-reactor";
import {ShipNameGenerator} from "@auto/setup/ship-name-generator";

// TODO: make this less wasteful
export async function processShip(ship: Ship | ScannedShip) {
  if ("modules" in ship) {
    for (const module of ship.modules) {
      await storeShipModule(module);
    }
  }
  if (ship.mounts) {
    for (const module of ship.mounts) {
      await storeShipMount(module);
    }
  }

  if (ship.frame) {
    await processShipFrame(ship.frame);
  }
  await storeShipEngine(ship.engine);
  if (ship.reactor) {
    await storeShipReactor(ship.reactor);
  }

  const shipData = {
    symbol: ship.symbol,
    name: ship.registration.name,
    agent: ship.registration.name.split("-").slice(0, 1).join(),
    factionSymbol: ship.registration.factionSymbol,
    role: ship.registration.role,

    currentSystem: {
      connect: {
        symbol: ship.nav.systemSymbol,
      },
    },
    currentWaypoint: {
      connect: {
        symbol: ship.nav.waypointSymbol,
      },
    },

    destinationWaypoint: {
      connect: {
        symbol: ship.nav.route.destination.symbol,
      },
    },
    departureWaypoint: {
      connect: {
        symbol: ship.nav.route.departure.symbol,
      },
    },
    departureOn: ship.nav.route.departureTime,
    arrivalOn: ship.nav.route.arrival,

    navStatus: ship.nav.status,
    flightMode: ship.nav.flightMode,

    fuelCapacity: 'fuel' in ship ? ship.fuel?.capacity : undefined,
    fuelAvailable: 'fuel' in ship ? ship.fuel?.current : undefined,

    cargoCapacity: 'fuel' in ship ? ship.cargo?.capacity : undefined,
    cargoUsed: 'fuel' in ship ? ship.cargo?.units : undefined,

    frame: {
      connect: {
        symbol: ship.frame?.symbol,
      },
    },
    reactor: {
      connect: {
        symbol: ship.reactor?.symbol,
      },
    },
    engine: {
      connect: {
        symbol: ship.engine.symbol,
      },
    },
    modules: {
      connect:
        "modules" in ship
          ? ship.modules.map((m) => ({symbol: m.symbol}))
          : [],
    },
    mounts: {
      connect: ship.mounts?.map((m) => ({symbol: m.symbol})),
    },
  };
  const generator = new ShipNameGenerator();
  await prisma.ship.upsert({
    where: {
      symbol: ship.symbol,
    },
    create: {
      ...shipData,
      callsign: generator.common
    },
    update: shipData,
  });

  if ("cargo" in ship) {
    await processCargo(ship.symbol, ship.cargo);
  }
}

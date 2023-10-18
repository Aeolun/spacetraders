import {
  CreateShipWaypointScan201ResponseData,
  GetSystemWaypoints200Response,
  ScannedWaypoint,
  Waypoint
} from "spacetraders-sdk";
import {prisma} from "@common/prisma";

import {storeWaypoint} from "@common/lib/data-update/store-waypoint";

export async function storeWaypointScan(systemSymbol: string, data: CreateShipWaypointScan201ResponseData | GetSystemWaypoints200Response) {
  const waypoints: (Waypoint | ScannedWaypoint)[] = 'waypoints' in data ? data.waypoints : data.data

  let faction
  let hasUncharted = false, hasMarket = false, hasShipyard = false, hasBelt = false
  await Promise.all(waypoints.map(async waypoint => {
    if (waypoint.faction?.symbol) {
      faction = waypoint.faction.symbol
    }
    waypoint.traits.forEach(trait => {
      if (trait.symbol === 'UNCHARTED') {
        hasUncharted = true
      }
      if (trait.symbol === 'MARKETPLACE') {
        hasMarket = true
      }
      if (trait.symbol === 'SHIPYARD') {
        hasShipyard = true
      }
      if (trait.symbol === 'COMMON_METAL_DEPOSITS' || trait.symbol === 'PRECIOUS_METAL_DEPOSITS' || trait.symbol === 'MINERAL_DEPOSITS') {
        hasBelt = true
      }
    })
    return storeWaypoint(waypoint)
  }))

  await prisma.system.update({
    where: {
      symbol: systemSymbol
    },
    data: {
      waypointsRetrieved: true,
      hasUncharted: hasUncharted,
      hasMarket: hasMarket,
      hasShipyard: hasShipyard,
      hasBelt: hasBelt,
      majorityFaction: faction
    }
  })

}
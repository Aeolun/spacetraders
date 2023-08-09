import {Ship} from "@app/ship/ship";
import {prisma} from "@app/prisma";

export const findMineableWaypoint = async (ship: Ship) => {
  const waypoint = await prisma.waypoint.findFirstOrThrow({
    where: {
      systemSymbol: ship.currentSystemSymbol,
      traits: {
        some: {
          symbol: {
            in: ['COMMON_METAL_DEPOSITS', 'RARE_METAL_DEPOSITS', 'PRECIOUS_METAL_DEPOSITS']
          }
        }
      }
    }
  })

  return waypoint
}
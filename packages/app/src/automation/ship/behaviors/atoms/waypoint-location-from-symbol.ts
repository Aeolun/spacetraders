import {prisma} from "@common/prisma";
import {LocationWithWaypointSpecifier} from "@auto/strategy/types";

export const waypointLocationFromSymbol = async (symbol: string): Promise<LocationWithWaypointSpecifier> => {
  const waypoint = await prisma.waypoint.findFirstOrThrow({
    where: {
      symbol: symbol
    },
    include: {
      system: {
        select: {
          symbol: true,
          x: true,
          y: true
        }
      }
    }
  })

  return {
    waypoint: {
      symbol: waypoint.symbol,
      x: waypoint.system.x,
      y: waypoint.system.y
    },
    system: {
      symbol: waypoint.system.symbol,
      x: waypoint.system.x,
      y: waypoint.system.y
    }
  }
}
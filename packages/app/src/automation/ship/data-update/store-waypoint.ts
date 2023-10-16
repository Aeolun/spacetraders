import {ScannedWaypoint, Waypoint} from "spacetraders-sdk";
import {prisma} from "@auto/prisma";

export async function storeWaypoint(waypoint: Waypoint | ScannedWaypoint) {
  if (waypoint.faction) {
    try {
      await prisma.faction.upsert({
        where: {
          symbol: waypoint.faction.symbol
        },
        create: {
          symbol: waypoint.faction.symbol,
          headquartersSymbol: null,
        },
        update: {},
      })
    } catch (error) {
      console.log("Error creating", waypoint.faction, error)
    }
  }


  try {
    const updateValues = {
      factionSymbol: waypoint.faction?.symbol,
      chartSubmittedBy: waypoint.chart?.submittedBy,
      chartSubmittedOn: waypoint.chart?.submittedOn,
      type: waypoint.type,
      systemSymbol: waypoint.systemSymbol,
      x: waypoint.x,
      y: waypoint.y,
      traits: {
        connectOrCreate: waypoint.traits.map(trait => {
          return {
            where: {
              symbol: trait.symbol,
            },
            create: {
              symbol: trait.symbol,
              name: trait.name,
              description: trait.description
            }
          }
        }),
      },
      orbitals: {
        connect: waypoint.orbitals.map(orb => {
          return {
            symbol: orb.symbol
          }
        })
      }
    }
    await prisma.waypoint.update({
      where: {
        symbol: waypoint.symbol
      },
      data: {
        traits: {
          set: []
        }
      }
    })
    return prisma.waypoint.upsert({
      where: {
        symbol: waypoint.symbol
      },
      include: {
        traits: true,
        jumpgate: {
          include: {
            validJumpTargets: true
          }
        }
      },
      create: {
        ...updateValues,
        symbol: waypoint.symbol,
      },
      update: updateValues
    })
  } catch (error) {
    console.error("Issue updating waypoint", error.toString())
  }
}
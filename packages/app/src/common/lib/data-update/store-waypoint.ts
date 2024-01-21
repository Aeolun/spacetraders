import {ScannedWaypoint, Waypoint} from "spacetraders-sdk";
import {prisma, Prisma} from "@common/prisma";
import {WaypointUpdateInput} from ".prisma/client";

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
    const updateValues: Prisma.WaypointUncheckedUpdateInput = {
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
      modifiers: 'modifiers' in waypoint ? {
        connectOrCreate: waypoint.modifiers?.map(mod => {
          return {
            where: {
              symbol: mod.symbol,
            },
            create: {
              symbol: mod.symbol,
              name: mod.name,
              description: mod.description
            }
          }
        }),
      } : undefined,
      orbitals: {
        connect: waypoint.orbitals.map(orb => {
          return {
            symbol: orb.symbol
          }
        })
      }
    }
    if ('isUnderConstruction' in waypoint) {
      updateValues.isUnderConstruction = waypoint.isUnderConstruction

      if (waypoint.modifiers) {
        updateValues.modifiers = {
          connectOrCreate: waypoint.modifiers.map(mod => {
            return {
              where: {
                symbol: mod.symbol,
              },
              create: {
                symbol: mod.symbol,
                name: mod.name,
                description: mod.description
              }
            }
          }),
        }
      }
    }
    await prisma.waypoint.update({
      where: {
        symbol: waypoint.symbol
      },
      data: {
        traits: {
          set: []
        },
        modifiers: {
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
        jumpConnectedTo: {
          select: {
            symbol: true
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
    console.error("Issue updating waypoint", error?.toString())
  }
}
import { DijkstraCalculator, LinkedListItem, PathReturnProperties } from '@aeolun/dijkstra-calculator'
import {prisma, System, Waypoint} from '@common/prisma'
import {getDistance} from "@common/lib/getDistance";
import { System as STSystem } from 'spacetraders-sdk'

export class SystemWayfinding {
    dijkstra?: DijkstraCalculator<'fuel'>

    constructor() {}

    async findRoute(fromWaypoint: string, toWaypoint: string, fuel: { max: number, current: number }) {
        if (!this.dijkstra) {
            throw new Error("No dijkstra, load a system first.")
        }
        return this.dijkstra.calculateShortestPathAsLinkedListResult(fromWaypoint, toWaypoint, {
            supplies: {
                fuel: fuel.current
            },
            supplyCapacity: {
                fuel: fuel.max
            }
        })
    }

    async loadSystemFromDb(systemSymbol: string) {
        const dijkstra = this.dijkstra = new DijkstraCalculator();

        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol
            },
            include: {
                tradeGoods: {
                    where: {
                        tradeGoodSymbol: 'FUEL'
                    }
                }
            }
        });

        for (const waypoint of waypoints) {
            const fuelPrice = waypoint.tradeGoods.find(tg => tg.tradeGoodSymbol === 'FUEL')?.purchasePrice ?? 85;
            dijkstra?.addVertex(waypoint.symbol, {
                recover: {
                    fuel: (current, max) => {
                        const recover = max - current;
                        const costCount = Math.ceil(recover / 100);
                        return {
                            recoverAmount: recover,
                            cost: costCount * fuelPrice,
                        };
                    }
                }
            })
        }

        waypoints.forEach((waypoint) => {
            const waypointsWithin100 = waypoints
              .filter((otherWaypoint) => {
                  if (otherWaypoint.symbol === waypoint.symbol) {
                      return false;
                  }
                  const distance = getDistance(waypoint, otherWaypoint);
                  return distance <= 1200;
              });
            const clostestWaypoints = waypoints
              .filter(
                (otherWaypoint) =>
                  otherWaypoint.symbol !== waypoint.symbol &&
                  !waypointsWithin100.find((wp) => wp.symbol === otherWaypoint.symbol)
              )
              .sort((a, b) => {
                  const aDistance = getDistance(waypoint, a);
                  const bDistance = getDistance(waypoint, b);
                  return aDistance - bDistance;
              })
              .slice(0, 5);

            [...clostestWaypoints, ...waypointsWithin100].forEach((otherWaypoint) => {
                const distance = getDistance(waypoint, otherWaypoint);
                const creditsPerSecond = 3;
                const edgeCost = (speed: number, multiplier: number, distance: number) => {
                    return (
                      Math.floor(
                        Math.round(Math.max(distance, 1)) * (multiplier / speed) + 15
                      ) * creditsPerSecond
                    );
                };
                dijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 7.5, distance),
                    id: 'burn',
                    consumes: {
                        fuel: Math.max(distance * 2, 1),
                    },
                });
                dijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 15, distance),
                    id: 'cruise',
                    consumes: {
                        fuel: Math.max(distance, 1),
                    },
                });
                dijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 150, distance),
                    id: 'drift',
                    consumes: {
                        fuel: 1,
                    },
                });
            });
        });
    }

}
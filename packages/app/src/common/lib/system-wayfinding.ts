import { DijkstraCalculator, LinkedListItem, PathReturnProperties } from '@aeolun/dijkstra-calculator'
import {prisma, System, Waypoint} from '@common/prisma'
import {getDistance} from "@common/lib/getDistance";
import {ShipNavFlightMode, System as STSystem} from 'spacetraders-sdk'
import {travelCooldown} from "@auto/ship/behaviors/atoms/travel-cooldown";
import {jumpCooldown} from "@auto/ship/behaviors/atoms/jump-cooldown";

interface LoadableSystemData {
    system: System,
    waypoints: (Waypoint & {
        tradeGoods: {
            purchasePrice: number | null,
            tradeGoodSymbol: string
        }[],
        jumpConnectedTo: {
            symbol: string,
            system: {
                symbol: string,
                x: number,
                y: number
            }
        }[]
    })[]
}
export class SystemWayfinding {
    dijkstra: DijkstraCalculator<'fuel' | 'time3' | 'time10' | 'time30'>
    noFuelDijkstra: DijkstraCalculator<'fuel' | 'time3' | 'time10' | 'time30'>
    loadedSystems: Record<string, true> = {}

    constructor() {
        this.dijkstra = new DijkstraCalculator();
        this.noFuelDijkstra = new DijkstraCalculator();
    }

    extraCost(supply: Partial<Record<'fuel', number>>, max: Partial<Record<'fuel', number>>, spent: Partial<Record<'fuel', number>>, finalStep: boolean) {
        const fuelSupply = supply.fuel;
        const maxFuel = max.fuel;
        const spentFuel = spent.fuel;
        if (
          fuelSupply === undefined ||
          maxFuel === undefined ||
          spentFuel === undefined
        ) {
            return 0;
        }
        if (supply && max) {
            if (finalStep) {
                return 3000 * (1 - fuelSupply / maxFuel);
            }
        }
        return (spentFuel / 100) * 75;
    };

    async findRoute(fromWaypoint: string, toWaypoint: string, fuel: { max: number, current: number }) {
        if (!this.dijkstra) {
            throw new Error("No dijkstra, load a system first.")
        }
        return this.dijkstra.calculateShortestPathAsLinkedListResult(fromWaypoint, toWaypoint, {
            supplies: {
                fuel: fuel.current,
                time3: 1000000000,
                time10: 1000000000,
                time30: 1000000000,
            },
            supplyCapacity: {
                fuel: fuel.max,
                time3: 1000000000,
                time10: 1000000000,
                time30: 1000000000,
            }
        })
    }

    async findRouteNoFuel(fromWaypoint: string, toWaypoint: string) {
        if (!this.noFuelDijkstra) {
            throw new Error("No dijkstra, load a system first.")
        }
        return this.noFuelDijkstra.calculateShortestPathAsLinkedListResult(fromWaypoint, toWaypoint, {
            supplies: {
                time3: 1000000000,
                time10: 1000000000,
                time30: 1000000000,
            },
            supplyCapacity: {
                time3: 1000000000,
                time10: 1000000000,
                time30: 1000000000,
            }
        })
    }

    async reset() {
        this.dijkstra = new DijkstraCalculator();
        this.noFuelDijkstra = new DijkstraCalculator();
        this.loadedSystems = {}
    }

    async preloadSystemsWaypoints() {
        const batchSize = 1000;
        let i = 0;
        while(true) {
            const systems = await prisma.system.findMany({
                include: {
                    waypoints: {
                        include: {
                            tradeGoods: {
                                where: {
                                    tradeGoodSymbol: 'FUEL'
                                }
                            },
                            jumpConnectedTo: {
                                select: {
                                    symbol: true,
                                    system: {
                                        select: {
                                            symbol: true,
                                            x: true,
                                            y: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                skip: i,
                take: batchSize
            });
            for (const system of systems) {
                const {waypoints, ...rest} = system;
                await this.loadSystemFromDb(system.symbol, false, {
                    system: rest,
                    waypoints,
                })
            }
            i += batchSize;
            if (systems.length < batchSize) {
                break;
            }
        }
    }

    async loadSystemData(systemSymbol: string): Promise<LoadableSystemData> {
        const system = await prisma.system.findFirstOrThrow({
            where: {
                symbol: systemSymbol
            },
        });
        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol
            },
            include: {
                tradeGoods: {
                    where: {
                        tradeGoodSymbol: 'FUEL'
                    }
                },
                jumpConnectedTo: {
                    select: {
                        symbol: true,
                        system: {
                            select: {
                                symbol: true,
                                x: true,
                                y: true
                            }
                        }
                    }
                }
            }
        });

        return {
            system,
            waypoints
        }
    }

    async loadSystemFromDb(systemSymbol: string, loadConnectedSystems = true, systemData?: LoadableSystemData) {
        if (this.loadedSystems[systemSymbol]) {
            return;
        }
        this.loadedSystems[systemSymbol] = true;
        console.log("Loading system", systemSymbol)

        const dijkstra = this.dijkstra
        const noFuelDijkstra = this.noFuelDijkstra

        const {system, waypoints} = systemData ?? await this.loadSystemData(systemSymbol);

        for (const waypoint of waypoints) {
            const hasFuel = waypoint.tradeGoods.find(tg => tg.tradeGoodSymbol === 'FUEL');
            const fuelPrice = hasFuel?.purchasePrice ?? 85;
            dijkstra?.addVertex(waypoint.symbol, {
                recover: hasFuel ? {
                    fuel: (current, max) => {
                        const recover = max - current;
                        const costCount = Math.ceil(recover / 100);
                        return {
                            recoverAmount: recover,
                            cost: costCount * fuelPrice,
                        };
                    }
                } : undefined,
            })
            noFuelDijkstra?.addVertex(waypoint.symbol)
        }
        console.log(`Loaded ${waypoints.length} waypoints`)
        const creditsPerSecond = 3;

        for(const waypoint of waypoints)  {
            if (waypoint.type === 'JUMP_GATE') {
                const connectedWaypoints = waypoint.jumpConnectedTo;
                for(const connectedWaypoint of connectedWaypoints) {
                    if (loadConnectedSystems) {
                        // load this system into the route planner
                        await this.loadSystemFromDb(connectedWaypoint.system.symbol)
                    }

                    dijkstra.addEdge(waypoint.symbol, connectedWaypoint.symbol, {
                        weight: jumpCooldown(getDistance(system, connectedWaypoint.system)) * creditsPerSecond,
                        id: 'jump',
                        consumes: {
                            time3: jumpCooldown(getDistance(system, connectedWaypoint.system)),
                            time10: jumpCooldown(getDistance(system, connectedWaypoint.system)),
                            time30: jumpCooldown(getDistance(system, connectedWaypoint.system)),
                        },
                        extraCost: this.extraCost
                    });
                    noFuelDijkstra.addEdge(waypoint.symbol, connectedWaypoint.symbol, {
                        weight: jumpCooldown(getDistance(system, connectedWaypoint.system))* creditsPerSecond,
                        id: 'jump',
                        consumes: {
                            time3: jumpCooldown(getDistance(system, connectedWaypoint.system)),
                            time10: jumpCooldown(getDistance(system, connectedWaypoint.system)),
                            time30: jumpCooldown(getDistance(system, connectedWaypoint.system)),
                        }
                    });
                }
            }
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

            for(const otherWaypoint of [...clostestWaypoints, ...waypointsWithin100]) {
                const distance = getDistance(waypoint, otherWaypoint);
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
                        time3: travelCooldown(distance, ShipNavFlightMode.Burn, 3),
                        time10: travelCooldown(distance, ShipNavFlightMode.Burn, 10),
                        time30: travelCooldown(distance, ShipNavFlightMode.Burn, 30),
                    },
                    extraCost: this.extraCost
                });
                dijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 15, distance),
                    id: 'cruise',
                    consumes: {
                        fuel: Math.max(distance, 1),
                        time3: travelCooldown(distance, ShipNavFlightMode.Cruise, 3),
                        time10: travelCooldown(distance, ShipNavFlightMode.Cruise, 10),
                        time30: travelCooldown(distance, ShipNavFlightMode.Cruise, 30),
                    },
                    extraCost: this.extraCost
                });
                dijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 150, distance),
                    id: 'drift',
                    consumes: {
                        fuel: 1,
                        time3: travelCooldown(distance, ShipNavFlightMode.Drift, 3),
                        time10: travelCooldown(distance, ShipNavFlightMode.Drift, 10),
                        time30: travelCooldown(distance, ShipNavFlightMode.Drift, 30),
                    },
                    extraCost: this.extraCost
                });
                noFuelDijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 7.5, distance),
                    id: 'burn',
                    consumes: {
                        time3: travelCooldown(distance, ShipNavFlightMode.Burn, 3),
                        time10: travelCooldown(distance, ShipNavFlightMode.Burn, 10),
                        time30: travelCooldown(distance, ShipNavFlightMode.Burn, 30),
                    }
                });
                noFuelDijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 15, distance),
                    id: 'cruise',
                    consumes: {
                        time3: travelCooldown(distance, ShipNavFlightMode.Cruise, 3),
                        time10: travelCooldown(distance, ShipNavFlightMode.Cruise, 10),
                        time30: travelCooldown(distance, ShipNavFlightMode.Cruise, 30),

                    }
                });
                noFuelDijkstra.addEdge(waypoint.symbol, otherWaypoint.symbol, {
                    weight: edgeCost(30, 150, distance),
                    id: 'drift',
                    consumes: {
                        time3: travelCooldown(distance, ShipNavFlightMode.Drift, 3),
                        time10: travelCooldown(distance, ShipNavFlightMode.Drift, 10),
                        time30: travelCooldown(distance, ShipNavFlightMode.Drift, 30),
                    }
                });
            };
        };
    }

}
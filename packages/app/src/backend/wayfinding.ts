import { DijkstraCalculator, LinkedListItem, PathReturnProperties } from '@aeolun/dijkstra-calculator'
import {prisma} from '@app/prisma'
import {getDistance} from "@common/lib/getDistance";
import {Ship} from "@app/ship/ship";

class Wayfinding {
    dijkstra?: DijkstraCalculator
    jumpDijkstra?: DijkstraCalculator
    init: Promise<void>
    constructor() {
        this.init = this.loadWaypoints().catch(error => {
            console.error("failure loading dijkstra waypoints", error)
        })
    }

    async findRoute(fromSystem: string, toSystem: string, fuel: { max: number, current: number }) {
        await this.init

        return this.dijkstra.calculateShortestPathAsLinkedListResult(fromSystem, toSystem, {
            supplies: {
                fuel: fuel.current
            },
            maxSupplies: {
                fuel: fuel.max
            }
        })
    }

    async findJumpRoute(fromSystem: string, toSystem: string, fuel: { max: number, current: number }) {
        await this.init

        return this.jumpDijkstra.calculateShortestPathAsLinkedListResult(fromSystem, toSystem, {
            supplies: {
                fuel: fuel.current
            },
            maxSupplies: {
                fuel: fuel.max
            }
        })
    }

    async loadWaypoints() {
        this.dijkstra = new DijkstraCalculator()
        this.jumpDijkstra = new DijkstraCalculator()

        const systems = await prisma.system.findMany({
            where: {
                waypoints: {
                    some: {
                        symbol: {
                            contains: 'X1'
                        }
                    }
                }
            }
        })

        systems.forEach(system => {
            this.dijkstra.addVertex(system.symbol, {
                recover: system.hasFuel ? {
                    fuel: true
                } : undefined
            })
            this.jumpDijkstra.addVertex(system.symbol, {
                recover: system.hasFuel ? {
                    fuel: true
                } : undefined
            })
        })
        let edges = 0;

        systems.forEach(system => {
            const nearbySystems = systems.filter(nearbySystem => {
                return getDistance(system, nearbySystem) < 2000
            }).map(nearbySystem => {
                return {
                    system: nearbySystem,
                    distance: getDistance(system, nearbySystem)
                }
            })
            nearbySystems.forEach(nearbySystem => {
                // increase cost function by fuel cost
                this.dijkstra.addEdge(system.symbol, nearbySystem.system.symbol, {
                    weight: ((Math.round(nearbySystem.distance) * (30 / 30) + 15) * 10) + (nearbySystem.distance / 100 * 120),
                    id: 'cruise',
                    consumes: {
                        fuel: nearbySystem.distance
                    }
                })
                edges++
                this.dijkstra.addEdge(system.symbol, nearbySystem.system.symbol, {
                    weight: ((Math.round(nearbySystem.distance) * (15 / 30) + 15) * 10) + (nearbySystem.distance*2 / 100 * 120),
                    id: 'burn',
                    consumes: {
                        fuel: nearbySystem.distance*2
                    }
                })
                edges++
                this.dijkstra.addEdge(system.symbol, nearbySystem.system.symbol, {
                    weight: ((Math.round(nearbySystem.distance) * (300 / 30) + 15) * 10) + (1 / 100 * 120),
                    id: 'drift',
                    consumes: {
                        fuel: 1
                    }
                })
                edges++
            })

            if (system.hasJumpGate) {
                systems.filter(nearbySystem => {
                    return nearbySystem.hasJumpGate && getDistance(system, nearbySystem) <= system.jumpgateRange && system.symbol !== nearbySystem.symbol
                }).forEach(connection => {
                    const systemSymbol = system.symbol
                    const toSystemSymbol = connection.symbol

                    this.dijkstra.addEdge(systemSymbol, toSystemSymbol, {
                        id: 'jump',
                        weight: Math.max(getDistance(system, connection) / 10, 60) * 10
                    })
                    this.jumpDijkstra.addEdge(systemSymbol, toSystemSymbol, {
                        id: 'jump',
                        weight: Math.max(getDistance(system, connection) / 10, 60) * 10
                    })
                    edges++
                })
            }
        })

        console.log(`Reloaded edges for ${systems.length} systems, ${edges} edges`)
    }
}

export function printRoute(route: LinkedListItem[], pathProperties: PathReturnProperties) {
    console.log("=== Route ===")

    const rows = route.map((trip, index) => {
        return {
            method: trip.edge,
            from: trip.source,
            to: trip.target,
            cost: Math.round(trip.weight),
            fuel: Math.round(trip.consumes?.fuel ?? 0),
            refuel: trip.recover && trip.recover.fuel > 0 ? Math.round(trip.recover.fuel) : 0
        }
    })
    console.table(rows, ['method', 'from', 'to', 'cost', 'fuel', 'refuel'])
    console.log(`Total cost: ${pathProperties.priority}cr, took ${pathProperties.timeTaken}ms`)
    console.log("=============")
}

export const defaultWayfinder = new Wayfinding()
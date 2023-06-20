import { DijkstraCalculator } from '@aeolun/dijkstra-calculator'
import {prisma} from '@app/prisma'
import {getDistance} from "@common/lib/getDistance";

class Wayfinding {
    dijkstra?: DijkstraCalculator
    jumpDijkstra?: DijkstraCalculator
    init: Promise<void>
    constructor() {
        this.init = this.loadWaypoints().catch(error => {
            console.error("failure loading dijkstra waypoints", error)
        })
    }

    async findRoute(fromSystem: string, toSystem: string) {
        await this.init

        return this.dijkstra.calculateShortestPathAsLinkedListResult(fromSystem, toSystem)
    }

    async findJumpRoute(fromSystem: string, toSystem: string) {
        await this.init

        return this.jumpDijkstra.calculateShortestPathAsLinkedListResult(fromSystem, toSystem)
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
            this.dijkstra.addVertex(system.symbol)
            this.jumpDijkstra.addVertex(system.symbol)
        })

        systems.forEach(system => {
            const nearbySystems = systems.filter(nearbySystem => {
                return getDistance(system, nearbySystem) < 1000
            }).map(nearbySystem => {
                return {
                    system: nearbySystem,
                    distance: getDistance(system, nearbySystem)
                }
            })
            nearbySystems.forEach(nearbySystem => {
                this.dijkstra.addEdge(system.symbol, nearbySystem.system.symbol, nearbySystem.distance)
            })

            if (system.hasJumpGate) {
                systems.filter(nearbySystem => {
                    return nearbySystem.hasJumpGate && getDistance(system, nearbySystem) <= 2000 && system.symbol !== nearbySystem.symbol
                }).forEach(connection => {
                    const systemSymbol = system.symbol
                    const toSystemSymbol = connection.symbol

                    this.dijkstra.addEdge(systemSymbol, toSystemSymbol, 1)
                    this.jumpDijkstra.addEdge(systemSymbol, toSystemSymbol, getDistance(system, connection))
                })
            }
        })

        console.log(`Reloaded edges for ${systems.length} systems`)
    }
}

export const defaultWayfinder = new Wayfinding()
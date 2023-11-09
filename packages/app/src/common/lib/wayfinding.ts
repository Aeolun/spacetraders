import { DijkstraCalculator, LinkedListItem, PathReturnProperties } from '@aeolun/dijkstra-calculator'
import {prisma, System, Waypoint} from '@common/prisma'
import {getDistance} from "@common/lib/getDistance";
import { System as STSystem } from 'spacetraders-sdk'

export interface WayfindingSystem {
    symbol: string
    x: number
    y: number
    hasFuel: boolean
    hasJumpGate: boolean
    jumpConnectedSystems: string[]
}

export interface SimpleSystem {
    symbol: string
    x: number
    y: number
    hasFuel?: boolean
    hasJumpGate?: boolean
}

type WayfindDbSystem = System & { waypoints: ({ symbol: string, type: string, jumpConnectedTo: { symbol: string }[] })[] }

export class Wayfinding {
    dijkstra?: DijkstraCalculator<'fuel'>
    jumpDijkstra?: DijkstraCalculator<'fuel'>
    alreadyConnected = new Set<string>()
    edges = 0
    furthestDistance = 2000
    systemMap: Record<string, {x: number, y: number}> = {}
    waypointMap: Record<string, {x: number, y: number, systemSymbol: string}> = {}
    systemArray: SimpleSystem[] = []
    init: Promise<void>
    connectedSystems: Record<string, {
        system: string,
        distance: number
        methods: string[]
    }[]> = {}
    constructor() {}

    async findRoute(fromSystem: string, toSystem: string, fuel: { max: number, current: number }) {
        await this.init

        if (!this.dijkstra) {
            throw new Error("No dijkstra")
        }
        return this.dijkstra.calculateShortestPathAsLinkedListResult(fromSystem, toSystem, {
            supplies: {
                fuel: fuel.current
            },
            supplyCapacity: {
                fuel: fuel.max
            }
        })
    }

    async findJumpRoute(fromSystem: string, toSystem: string, fuel: { max: number, current: number }) {
        await this.init

        if (!this.jumpDijkstra) {
            throw new Error("No jump dijkstra")
        }
        return this.jumpDijkstra.calculateShortestPathAsLinkedListResult(fromSystem, toSystem, {
            supplies: {
                fuel: fuel.current
            },
            supplyCapacity: {
                fuel: fuel.max
            }
        })
    }

    addConnection(fromSystem: string, toSystem: string, distance: number, methods: string[]) {
        if (!this.connectedSystems[fromSystem]) {
            this.connectedSystems[fromSystem] = [{
                system: toSystem,
                distance,
                methods
            }]
        } else if (!this.connectedSystems[fromSystem].some(connection => connection.system === toSystem)) {
            // if not connected yet, add toSystem
            this.connectedSystems[fromSystem].push({
                system: toSystem,
                distance,
                methods
            })
        } else if(this.connectedSystems[fromSystem].find(connection => connection.system === toSystem)) {
            // if already connected, add methods
            this.connectedSystems[fromSystem].find(connection => connection.system === toSystem)?.methods.push(...methods)
        }
    }

    getConnectionsForSystem(system: string) {
        return this.connectedSystems[system]
    }

    addRoutes(system: WayfindingSystem) {
        if (system.hasJumpGate) {
            system.jumpConnectedSystems.forEach(waypointSymbol => {
                const connectionId = [system.symbol, waypointSymbol].sort().join('-')+'jump'
                if (this.alreadyConnected.has(connectionId)) {
                    return;
                }
                this.alreadyConnected.add(connectionId)

                const systemSymbol = system.symbol
                if (!this.waypointMap[waypointSymbol]) {
                    throw new Error(`Cannot find waypoint ${waypointSymbol} in waypointMap`)
                }
                const toSystemSymbol = this.waypointMap[waypointSymbol].systemSymbol

                this.dijkstra.addEdge(systemSymbol, toSystemSymbol, {
                    id: 'jump',
                    weight: getDistance(system, this.waypointMap[waypointSymbol]),
                })
                this.jumpDijkstra.addEdge(systemSymbol, toSystemSymbol, {
                    id: 'jump',
                    weight: getDistance(system, this.waypointMap[waypointSymbol])
                })
                this.addConnection(systemSymbol, toSystemSymbol, getDistance(system, this.waypointMap[waypointSymbol]), ['jump'])
                this.edges++
            })
        }
        const nearbySystems = this.systemArray.filter(nearbySystem => {
            return getDistance(system, nearbySystem) <= this.furthestDistance+1 && !nearbySystem.hasJumpGate
        }).map(nearbySystem => {
            return {
                system: nearbySystem,
                distance: getDistance(system, nearbySystem)
            }
        }).sort((a, b) => {
            // closest 5 systems
            return a.distance - b.distance
        }).slice(0, 7)
        // nearby systems only counts the closest 5 systems that do NOT have a jump gate for purposes of adding edges
        nearbySystems.forEach(nearbySystem => {
            const connectionId = [system.symbol, nearbySystem.system.symbol].sort().join('-')
            if (this.alreadyConnected.has(connectionId)) {
                return;
            }
            this.alreadyConnected.add(connectionId)
            if (nearbySystem.distance > 2500) {
                // increase cost function by fuel cost
                this.dijkstra.addEdge(system.symbol, nearbySystem.system.symbol, {
                    weight: nearbySystem.distance * 1.2,
                    // weight: ((Math.round(nearbySystem.distance) * (30 / 30) + 15) * 10) + (nearbySystem.distance / 100 * 120),
                    id: 'cruise',
                    consumes: {
                        fuel: nearbySystem.distance
                    }
                })
                this.edges++
                this.dijkstra.addEdge(system.symbol, nearbySystem.system.symbol, {
                    weight: nearbySystem.distance * 2,
                    // weight: ((Math.round(nearbySystem.distance) * (15 / 30) + 15) * 10) + (nearbySystem.distance * 2 / 100 * 120),
                    id: 'burn',
                    consumes: {
                        fuel: nearbySystem.distance * 2
                    }
                })
                this.edges++
                this.dijkstra.addEdge(system.symbol, nearbySystem.system.symbol, {
                    weight: nearbySystem.distance * 100,
                    // weight: ((Math.round(nearbySystem.distance) * (300 / 30) + 15) * 10) + (1 / 100 * 120),
                    id: 'drift',
                    consumes: {
                        fuel: 1
                    }
                })
                this.edges++

                this.addConnection(system.symbol, nearbySystem.system.symbol, nearbySystem.distance, ['cruise', 'burn', 'drift'])
            }
        })
    }

    resetData(systems: SimpleSystem[]) {
        this.systemMap = {}
        this.waypointMap = {}
        this.systemArray = []

        systems.forEach(system => {
            this.systemMap[system.symbol] = {
                x: system.x,
                y: system.y
            }
            this.systemArray.push({
                symbol: system.symbol,
                x: system.x,
                y: system.y
            })
        });


        this.alreadyConnected = new Set<string>()
        this.edges = 0;
        this.furthestDistance = 0;
        this.dijkstra = new DijkstraCalculator((current, target) => {
            //return 0
            return getDistance(this.systemMap[current], this.systemMap[target]) * 0.999;
        })
        this.jumpDijkstra = new DijkstraCalculator((current, target) => {
            //return 0
            return getDistance(this.systemMap[current], this.systemMap[target]) * 0.999;
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
    }

    async loadWaypointsFromJson(systems: STSystem[]) {
        const simpleSystems = systems.map(system => {
            return {
                symbol: system.symbol,
                x: system.x,
                y: system.y,
                hasFuel: system.waypoints.some(wp => wp.type === 'PLANET' || wp.type === 'MOON'),
                hasJumpGate: system.waypoints.some(wp => wp.type === 'JUMP_GATE'),
                jumpGateWaypoint: system.waypoints.find(wp => wp.type === 'JUMP_GATE')?.symbol
            }
        })

        this.resetData(simpleSystems);

        const {furthest, furthestDistance} = findClosestSystems(simpleSystems)
        this.furthestDistance = furthestDistance
        console.log("furthest distance between two systems", furthestDistance, ' between ', furthest)

        systems.forEach(system => {
            system.waypoints.forEach(wp => this.waypointMap[wp.symbol] = {x: system.x, y: system.y, systemSymbol: system.symbol })
        });
        systems.forEach(system => {
            this.addRoutes({
                symbol: system.symbol,
                x: system.x,
                y: system.y,
                hasJumpGate: system.waypoints.some(wp => wp.type === 'JUMP_GATE'),
                // this is obviously incorrect, but it's a decent approximation
                hasFuel: system.waypoints.some(wp => wp.type === 'PLANET' || wp.type === 'MOON'),
                jumpConnectedSystems: system.waypoints.some(wp => wp.type === 'JUMP_GATE') ? simpleSystems.filter(s => s.symbol !== system.symbol && s.hasJumpGate && getDistance(system, s) <= 2500).map(s => s.jumpGateWaypoint) : []
            })
        })

        console.log(`Reloaded edges for ${systems.length} systems, ${this.edges} edges`)
    }

    async addSystemFromDatabase(systemSymbol: string) {
        const system = await prisma.system.findFirst({
            include: {
                waypoints: {
                    where: {
                        type: 'JUMP_GATE'
                    },
                    include: {
                        jumpConnectedTo: {
                            select: {
                                symbol: true
                            }
                        }
                    }
                }
            },
            where: {
                symbol: systemSymbol
            }
        })
        this.addRoutes(this.systemToWayfindingSystem(system))
    }


    private systemToWayfindingSystem(system: WayfindDbSystem) {
        const jumpTargets: string[] = []

        const jumpGate = system.waypoints.find(wp => wp.type === 'JUMP_GATE')
        jumpGate?.jumpConnectedTo.forEach(jt => {
            jumpTargets.push(jt.symbol)
        })
        return {
            symbol: system.symbol,
            x: system.x,
            y: system.y,
            hasFuel: system.hasFuel,
            hasJumpGate: system.hasJumpGate,
            jumpConnectedSystems: jumpTargets
        }
    }

    async loadWaypointsFromDb() {
        const systems = await prisma.system.findMany({
            include: {
                waypoints: {
                    where: {
                        type: 'JUMP_GATE'
                    },
                    select: {
                        symbol: true,
                        jumpConnectedTo: {
                            select: {
                                symbol: true
                            }
                        }
                    }
                }
            },
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
        console.log("loaded systems", systems.length)

        const wayfindingSystems = systems.map(system => {
            return this.systemToWayfindingSystem(system)
        });

        this.resetData(wayfindingSystems);

        systems.forEach(system => {
            system.waypoints.forEach(wp => {
                this.waypointMap[wp.symbol] = {x: system.x, y: system.y, systemSymbol: system.symbol }
            })
        });

        const {furthest, furthestDistance} = findClosestSystems(wayfindingSystems)
        this.furthestDistance = furthestDistance
        console.log("furthest distance between two systems", furthestDistance, ' between ', furthest)

        wayfindingSystems.forEach(system => {
            this.addRoutes(system)
        })

        console.log(`Reloaded edges for ${systems.length} systems, ${this.edges} edges`)
    }


}

export function findClosestSystems(systems: SimpleSystem[]) {
    let furthestDistance = 0
    let furthest = ''
    systems.forEach(system => {
        let closest;
        let closestSystem = 100000000
        systems.forEach(nearbySystem => {
            if (system.symbol !== nearbySystem.symbol) {
                const distance = getDistance(system, nearbySystem)
                if (distance <= closestSystem) {
                    closestSystem = distance
                    closest = nearbySystem.symbol
                }
            }
        })

        if (closestSystem > furthestDistance) {
            furthestDistance = closestSystem
            furthest = system.symbol + '-' + closest
        }
    })
    return {
        furthest,
        furthestDistance
    }
}
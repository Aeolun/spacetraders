import { DijkstraCalculator, LinkedListItem, PathReturnProperties } from '@aeolun/dijkstra-calculator'
import {prisma, System, Waypoint} from '@common/prisma'
import {getDistance} from "@common/lib/getDistance";
import { System as STSystem } from 'spacetraders-sdk'

export class SystemWayfinding {
    dijkstra?: DijkstraCalculator

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
            maxSupplies: {
                fuel: fuel.max
            }
        })
    }

    async loadSystemFromDb(systemSymbol: string) {
        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol
            }
        });

        for (const waypoint of waypoints) {
            this.dijkstra?.addVertex(waypoint.symbol, {
                x: waypoint.x,
                y: waypoint.y,
                recover: {
                    fuel: true
                }
            })
        }
    }

}
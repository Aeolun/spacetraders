import {Container} from "pixi.js";
import type {Waypoint, WaypointTrait, Jumpgate, JumpConnectedSystem, Faction } from "@common/prisma";
import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@backend/server";
import {UniverseEntity} from "@front/viewer/universe-entity";


export type SelectedType = 'ship' | 'waypoint' | 'star'
export interface Registry {
    agent: Agent;
    selected?: {
        symbol: string;
        type: SelectedType;
    };

    // stuff for what UI displays
    currentView: 'universe' | 'system';
    hoveredSystem?: System;
    hoveredWaypoint?: Waypoint;
    currentSystem?: string;
    displayedMarket: string

    // source data for objects
    systemData: Record<string, System>
    waypointData: Record<string, WaypointData>
    waypointsForSystem: Record<string, Waypoint[]>
    shipData: Record<string, ShipData>

    // references to all the visible nodes
    transformedSystems: Record<string, boolean>
    systemObjects: Record<string, Container[]>
    systems: Record<string, UniverseEntity>
    universeShips: Record<string, UniverseEntity>
    waypoints: Record<string, UniverseEntity>

    factions: Record<string, Faction>

    deselect: () => void
}

export interface TradeGood {
    symbol: string
    kind: "EXPORT" | "IMPORT" | "EXCHANGE"
    tradeVolume: number
    supply: string
    purchasePrice: number
    sellPrice: number
}

export interface Agent {
    symbol: string
    credits: number
}

export type RouterOutputs = inferRouterOutputs<AppRouter>

export type WaypointData = Waypoint & {offset: number, traits: WaypointTrait[], jumpgate: Jumpgate & {validJumpTargets: JumpConnectedSystem[]}}

export type ShipData = RouterOutputs['instructRefuel']

export interface ShipModule {
    effectName: string
    value: number
}
export interface ShipMount {
    effectName: string
    value: number
}

export type System = RouterOutputs['getSystems'][number]



export const Registry: Registry = {
    agent: {
        symbol: '',
        credits: 0
    },
    transformedSystems: {},
    currentView: 'universe',
    currentSystem: undefined,
    selected: undefined,
    systemObjects: {},
    waypointsForSystem: {},
    factions: {},
    shipData: {},
    waypoints: {},
    systems: {},
    universeShips: {},
    displayedMarket: undefined,
    systemData: {},
    waypointData: {},

    deselect: () => {
        if (Registry.selected) {
            if (Registry.selected.type === 'waypoint') {
                Registry.waypoints[Registry.selected.symbol].deselect()
            } else if (Registry.selected.type === 'ship') {
                Registry.universeShips[Registry.selected.symbol].deselect()
            } else if (Registry.selected.type === 'star') {
                Registry.systems[Registry.selected.symbol].deselect()
            }
            Registry.selected = undefined
        }
    }
}
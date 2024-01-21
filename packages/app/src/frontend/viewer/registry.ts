import {Container} from "pixi.js";
import type {Waypoint, WaypointTrait, TradeGoodKind, Faction, WaypointModifier } from "@common/prisma";
import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@backend/server";
import {UniverseEntity} from "@front/viewer/universe-entity";
import {store} from "@front/ui/store";
import {selectionActions} from "@front/ui/slices/selection";
import {UniverseShip} from "@front/viewer/universe-ship";
import {clearMarketRoutes} from "@front/viewer/display-export-market";


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
    displayedMarket: string | undefined;

    // source data for objects
    systemData: Record<string, System>
    waypointData: Record<string, WaypointData>
    waypointsForSystem: Record<string, WaypointData[]>
    universeJumpData: Record<string, string[]>
    shipData: Record<string, ShipData>

    // references to all the visible nodes
    transformedSystems: Record<string, boolean>
    systemObjects: Record<string, Container[]>
    systems: Record<string, UniverseEntity>
    universeShips: Record<string, UniverseShip>
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

export type WaypointData = Waypoint & {offset: number, traits: WaypointTrait[], modifiers: WaypointModifier[], jumpConnectedTo: {symbol: string,x: number, y: number}[], tradeGoods: { tradeGoodSymbol: string, kind: TradeGoodKind }[]}

export type ShipData = RouterOutputs['shipData']

export type ShipConfigurationData = RouterOutputs['getShipyard'][number]

export interface ShipModule {
    effectName: string
    value: number
}
export interface ShipMount {
    effectName: string
    value: number
}

export type System = RouterOutputs['getSystems'][number]

export const getSelectedEntity = () => {
    if (Registry.selected) {
        if (Registry.selected.type === 'waypoint') {
            return Registry.waypoints[Registry.selected.symbol]
        } else if (Registry.selected.type === 'ship') {
            return Registry.universeShips[Registry.selected.symbol]
        } else if (Registry.selected.type === 'star') {
            return Registry.systems[Registry.selected.symbol]
        }
    }
    return undefined;
}

export const getSelectedEntityData = () => {
    if (Registry.selected) {
        if (Registry.selected.type === 'waypoint') {
            return Registry.waypointData[Registry.selected.symbol]
        } else if (Registry.selected.type === 'ship') {
            return Registry.shipData[Registry.selected.symbol]
        } else if (Registry.selected.type === 'star') {
            return Registry.systemData[Registry.selected.symbol]
        }
    }
    return undefined;
}

export type GetEntityDataResult = {
    kind: 'ship',
    data: ShipData
} | {
    kind: 'waypoint',
    data: WaypointData
} | {
    kind: 'star',
    data: System
}

export const getEntityData = (symbol: string) : GetEntityDataResult => {
    if (Registry.shipData[symbol]) {
        return {
            kind: 'ship',
            data: Registry.shipData[symbol]
        }
    } else if (Registry.waypointData[symbol]) {
        return {
            kind: 'waypoint',
            data: Registry.waypointData[symbol]
        }
    } else if (Registry.systemData[symbol]) {
        return {
            kind: 'star',
            data: Registry.systemData[symbol]
        }
    }
    throw new Error(`entity ${symbol} does not exist`)
}

export const getEntityPosition = (symbol: string) => {
    const entity = getEntityData(symbol)
    if (entity?.kind === 'ship') {
        return {
            x: entity.data.currentWaypoint.x,
            y: entity.data.currentWaypoint.y
        }
    } else {
        return {
            x: entity.data.x,
            y: entity.data.y,
        }
    }
    throw new Error(`entity ${symbol} does not exist`)
}

export const Registry: Registry = {
    registerAgent: {
        symbol: '',
        credits: 0
    },
    universeJumpData: {},
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
            getSelectedEntity()?.deselect()
            Registry.selected = undefined
            store.dispatch(selectionActions.setSelection(undefined))
            clearMarketRoutes()
        }
    },
}
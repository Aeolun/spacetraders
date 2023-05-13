import {Container} from "pixi.js";

export interface GameState {
    currentView: 'universe' | 'system';
    selected?: {
        symbol: string;
        type: 'ship' | 'waypoint';
    };
    visibleShips: Record<string, {
        shipData: ShipData
        container: Container
    }>
    visibleWaypoints: Record<string, {
        waypointData: WaypointData
        container: Container
    }>
}

export interface WaypointData {
    symbol: string
    type: string
    traits: {
        symbol: string
        name: string
        description: string
    }[]
}

export interface ShipData {
    symbol: string,
    departureOn: string
    arrivalOn: string
    fuelAvailable: number
    fuelCapacity: number
    cargoCapacity: number
    cargoUsed: number
    reactorCooldownOn: string
    navStatus: 'IN_TRANSIT' | 'IN_ORBIT' | 'DOCKED'
    flightMode: 'DRIFT' | 'STEALTH' | 'CRUISE' | 'BURN'
    currentWaypoint: {
        symbol: string,
        x: number,
        y: number
    },
    departureWaypoint: {
        symbol: string,
        x: number,
        y: number
    },
    destinationWaypoint: {
        symbol: string,
        x: number
        y: number
    }
}

export const GameState: GameState = {
    currentView: 'universe',
    selected: undefined,
    visibleShips: {}
}
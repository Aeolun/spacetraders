import {Container} from "pixi.js";


export type SelectedType = 'ship' | 'waypoint'
export interface GameState {
    currentView: 'universe' | 'system';
    agent: Agent;
    selected?: {
        symbol: string;
        type: SelectedType;
    };
    currentSystem?: System;
    visibleSystems: Record<string, {
        systemData: System,
        container: Container
    }>
    shipData: Record<string, ShipData>
    hoveredSystem?: System;
    hoveredWaypoint?: Waypoint;
    systemShips: Record<string, Container>
    universeShips: Record<string, Container>
    visibleWaypoints: Record<string, {
        waypointData: WaypointData
        container: Container
    }>
    currentMarket: TradeGood
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

export interface WaypointData {
    symbol: string
    type: string
    x: number
    y: number
    factionSymbol: string
    chartSubmittedBy: string
    chartSubmittedOn: string
    traits: {
        symbol: string
        name: string
        description: string
    }[]
}

export interface Waypoint {
    symbol: string,
    x: number,
    y: number
    orbitsSymbol: string
    systemSymbol: string
}
export interface ShipData {
    symbol: string,
    role: string;
    agent: string;
    departureOn: string
    arrivalOn: string
    fuelAvailable: number
    fuelCapacity: number
    cargoCapacity: number
    cargoUsed: number
    reactorCooldownOn: string
    navStatus: 'IN_TRANSIT' | 'IN_ORBIT' | 'DOCKED'
    flightMode: 'DRIFT' | 'STEALTH' | 'CRUISE' | 'BURN'
    currentWaypoint: Waypoint,
    departureWaypoint: Waypoint,
    destinationWaypoint: Waypoint,
    updatedAt: string
    modules: ShipModule[]
    mounts: ShipMount[]
}

export interface ShipModule {
    effectName: string
    value: number
}
export interface ShipMount {
    effectName: string
    value: number
}

export interface System {
    symbol: string;
    type: string;
    x: number;
    y: number;
}



export const GameState: GameState = {
    agent: {
        symbol: '',
        credits: 0
    },
    currentView: 'universe',
    currentSystem: undefined,
    selected: undefined,
    systemShips: {},
    shipData: {},
    visibleWaypoints: {},
    visibleSystems: {},
    universeShips: {},
    currentMarket: undefined
}
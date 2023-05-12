import {Container} from "pixi.js";

export interface GameState {
    currentView: 'universe' | 'system';
    selected: {
        symbol: string;
        type: 'ship' | 'planet';
    };
    visibleShips: {
        shipData: any
        container: Container
    }[]
}

export interface PositionData {
    symbol: string,
    departureOn: string
    arrivalOn: string
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

export const GameState = {
    currentView: 'universe',
    selectedSymbol: undefined,
    visibleShips: []
}
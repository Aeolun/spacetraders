import {GameState} from "@app/lib/game-state";
import {trpc} from "@app/lib/trpc";
import {FederatedPointerEvent} from "pixi.js";

export const availableActions: {
    name: string
    action: (event: FederatedPointerEvent) => void
    isAvailable: () => boolean
}[] = [{
    name: 'Refuel',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected) {
            const refuel = await trpc.instructRefuel.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.visibleShips[refuel.symbol].shipData = refuel
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData
            return selectedShip.fuelAvailable < selectedShip.fuelCapacity && selectedShip.navStatus === 'DOCKED'
        }
        return false
    }
}, {
    name: 'Dock',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected) {
            const dock = await trpc.instructDock.mutate({
                shipSymbol: GameState.selected.symbol
            })
            console.log('dockresult', dock)
            GameState.visibleShips[dock.symbol].shipData = dock
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData
            return selectedShip.navStatus === 'IN_ORBIT' || (selectedShip.navStatus === 'IN_TRANSIT' && new Date(selectedShip.arrivalOn).getTime() < Date.now())
        }
        return false
    }
}, {
    name: 'Orbit',
    action:  async (event) => {
        event.stopPropagation();
        if (GameState.selected) {
            const orbit = await trpc.instructOrbit.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.visibleShips[orbit.symbol].shipData = orbit
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData
            return selectedShip.navStatus === 'DOCKED'
        }
        return false
    }
}, {
    name: 'Extract',
    action: () => {

    },
    isAvailable: () => {
        return false
    }
}, {
    name: 'Scan Wpt',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected) {
            const waypoints = await trpc.instructScanWaypoints.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.visibleShips[waypoints.symbol].shipData = waypoints
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData
            return selectedShip.navStatus === 'IN_ORBIT' && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime()
        }
        return false
    }
}, {
    name: 'Scan Shp',
    action: () => {

    },
    isAvailable: () => {
        return false
    }
}]
import {GameState} from "@app/lib/game-state";
import {trpc} from "@app/lib/trpc";
import {FederatedPointerEvent} from "pixi.js";
import {loadSystem} from "@app/lib/loadSystem";
import {updateCredits} from "@app/lib/loadPlayerData";

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
            GameState.myShips[refuel.symbol].shipData = refuel
            await updateCredits()
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.myShips[GameState.selected.symbol].shipData
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
            GameState.myShips[dock.symbol].shipData = dock
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.myShips[GameState.selected.symbol].shipData
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
            GameState.myShips[orbit.symbol].shipData = orbit
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.myShips[GameState.selected.symbol].shipData
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
    name: 'Chart',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected) {
            const orbit = await trpc.instructChart.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.myShips[orbit.symbol].shipData = orbit
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.myShips[GameState.selected.symbol].shipData
            return selectedShip.navStatus === 'IN_ORBIT' && !GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol].waypointData.chartSubmittedBy
        }
        return false
    }
}, {
    name: 'Scan Wpt',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected && GameState.currentSystem) {
            const waypoints = await trpc.instructScanWaypoints.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.myShips[waypoints.symbol].shipData = waypoints
            await loadSystem(GameState.currentSystem)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.myShips[GameState.selected.symbol].shipData
            return selectedShip.navStatus === 'IN_ORBIT' && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime()
        }
        return false
    }
}, {
    name: 'Scan Shp',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected && GameState.currentSystem) {
            const waypoints = await trpc.instructScanShips.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.myShips[waypoints.symbol].shipData = waypoints
            await loadSystem(GameState.currentSystem)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.myShips[GameState.selected.symbol].shipData
            return selectedShip.navStatus === 'IN_ORBIT' && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime() && selectedShip.mounts.filter(m => m.effectName === 'SENSOR_ARRAY').length > 0
        }
        return false
    }
}]
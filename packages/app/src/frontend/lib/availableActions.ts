import {GameState} from "@front/lib/game-state";
import {trpc} from "@front/lib/trpc";
import {FederatedPointerEvent} from "pixi.js";
import {loadSystem} from "@front/lib/loadSystem";
import {updateCredits} from "@front/lib/loadPlayerData";

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
            GameState.shipData[refuel.symbol] = refuel
            await updateCredits()
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
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
            GameState.shipData[dock.symbol] = dock
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
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
            GameState.shipData[orbit.symbol] = orbit
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            return selectedShip.navStatus === 'DOCKED'
        }
        return false
    }
}, {
    name: 'Extract',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected) {
            const shipInfo = await trpc.instructExtract.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.shipData[shipInfo.symbol] = shipInfo
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.visibleWaypoints) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'IN_ORBIT' && GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol].waypointData.traits.filter(t => t.symbol === 'COMMON_METAL_DEPOSITS' || t.symbol === 'MINERAL_DEPOSITS' || t.symbol === 'PRECIOUS_METAL_DEPOSITS').length > 0 && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime()
            }
        }
        return false
    }
}, {
    name: 'Sell All',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected) {
            const shipInfo = await trpc.instructSellCargo.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.shipData[shipInfo.symbol] = shipInfo
            await updateCredits()
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.visibleWaypoints) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && selectedShip.cargoUsed > 0
            }
        }
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
            GameState.shipData[orbit.symbol] = orbit
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.visibleWaypoints) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'IN_ORBIT' && !GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol].waypointData.chartSubmittedBy
            }
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
            GameState.shipData[waypoints.symbol] = waypoints
            await loadSystem(GameState.currentSystem)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
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
            GameState.shipData[waypoints.symbol] = waypoints
            await loadSystem(GameState.currentSystem)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship') {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            return selectedShip.navStatus === 'IN_ORBIT' && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime() && selectedShip.mounts.filter(m => m.effectName === 'SENSOR_ARRAY').length > 0
        }
        return false
    }
}, {
    name: 'Market',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected && GameState.currentSystem) {
            const market = await trpc.instructMarket.mutate({
                shipSymbol: GameState.selected.symbol,
                systemSymbol: GameState.currentSystem.symbol,
                waypointSymbol: GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol
            })

            // open market dialog
            console.log(market)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.visibleWaypoints) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol].waypointData.traits.filter(t => t.symbol === 'MARKETPLACE').length > 0
            }
        }
        return false
    }
}, {
    name: 'Shipyard',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected && GameState.currentSystem) {
            const market = await trpc.instructShipyard.mutate({
                shipSymbol: GameState.selected.symbol,
                systemSymbol: GameState.currentSystem.symbol,
                waypointSymbol: GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol
            })

            // open market dialog
            console.log(market)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.visibleWaypoints) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && GameState.visibleWaypoints[selectedShip.currentWaypoint.symbol].waypointData.traits.filter(t => t.symbol === 'SHIPYARD').length > 0
            }
        }
        return false
    }
}]
import {GameState} from "@front/lib/game-state";
import {trpc} from "@front/lib/trpc";
import {FederatedPointerEvent} from "pixi.js";
import {loadSystem} from "@front/lib/loadSystem";
import {updateCredits} from "@front/lib/loadPlayerData";
import {ShipyardWindow} from "@front/lib/ShipyardWindow";
import {uiOverlay} from "@front/lib/UIElements";
import {deselectListeners} from "@front/lib/makeInteractiveAndSelectable";

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
        if (GameState.selected?.type === 'ship' && GameState.waypointData) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'IN_ORBIT' && GameState.waypointData[selectedShip.currentWaypoint.symbol].traits.filter(t => t.symbol === 'COMMON_METAL_DEPOSITS' || t.symbol === 'MINERAL_DEPOSITS' || t.symbol === 'PRECIOUS_METAL_DEPOSITS').length > 0 && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime()
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
        if (GameState.selected?.type === 'ship' && GameState.waypointData) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.waypointData[selectedShip.currentWaypoint.symbol]) {
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
            const chartResult = await trpc.instructChart.mutate({
                shipSymbol: GameState.selected.symbol
            })
            GameState.shipData[chartResult.ship.symbol] = chartResult.ship
            GameState.waypointData[chartResult.waypoint.symbol] = chartResult.waypoint
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.waypointData) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'IN_ORBIT' && !GameState.waypointData[selectedShip.currentWaypoint.symbol].chartSubmittedBy
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
                systemSymbol: GameState.currentSystem,
                waypointSymbol: GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol
            })

            // open market dialog
            console.log(market)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.waypointData) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && GameState.waypointData[selectedShip.currentWaypoint.symbol].traits.filter(t => t.symbol === 'MARKETPLACE').length > 0
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
                systemSymbol: GameState.currentSystem,
                waypointSymbol: GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol
            })

            // open market dialog
            console.log(market)
            const shipyardData = await trpc.getShipyard.query({
                waypointSymbol: GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol
            })
            const shipyardWindow = new ShipyardWindow(shipyardData)

            uiOverlay.addChild(shipyardWindow.container.displayObject)
            shipyardWindow.container.displayObject.x = (window.innerWidth - 1000) / 2
            shipyardWindow.container.displayObject.y = (window.innerHeight - 600) / 2
            deselectListeners.once('deselect', () => {
                uiOverlay.removeChild(shipyardWindow.container.displayObject)
            })
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'ship' && GameState.waypointData) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && GameState.waypointData[selectedShip.currentWaypoint.symbol].traits.filter(t => t.symbol === 'SHIPYARD').length > 0
            }
        }
        return false
    }
}, {
    name: 'Jumpgate',
    action: async (event) => {
        event.stopPropagation();
        if (GameState.selected && GameState.currentSystem) {
            let waypointSymbol;
            if (GameState.selected.type == 'ship') {
                waypointSymbol = GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol
            } else {
                waypointSymbol = GameState.selected.symbol
            }
            const jumpgateInfo = await trpc.instructJumpGate.mutate({
                shipSymbol: GameState.selected.symbol,
                systemSymbol: GameState.currentSystem,
                waypointSymbol: waypointSymbol
            })

            // open market dialog
            console.log(jumpgateInfo)
        }
    },
    isAvailable: () => {
        if (GameState.selected?.type === 'waypoint') {
            return GameState.waypointData[GameState.selected.symbol].type === 'JUMP_GATE'
        }
        if (GameState.selected?.type === 'ship' && GameState.waypointData) {
            const selectedShip = GameState.shipData[GameState.selected.symbol]
            if (GameState.waypointData[selectedShip.currentWaypoint.symbol]) {
                return GameState.waypointData[selectedShip.currentWaypoint.symbol].type === 'JUMP_GATE'
            }
        }
        return false
    }
}]
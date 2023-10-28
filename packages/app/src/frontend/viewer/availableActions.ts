import {Registry} from "@front/viewer/registry";
import {trpc} from "@front/trpc";
import {FederatedPointerEvent} from "pixi.js";
import {loadSystem} from "@front/viewer/loadSystem";
import {updateCredits} from "@front/viewer/loadPlayerData";
import {ShipyardWindow} from "@front/viewer/ShipyardWindow";
import {behaviorWindow, uiOverlay} from "@front/viewer/UIElements";
import {deselectListeners} from "@front/viewer/makeInteractiveAndSelectable";

export const availableActions: {
    name: string
    action: (event: FederatedPointerEvent) => void
    isAvailable: () => boolean
}[] = [{
    name: 'Refuel',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected) {
            const refuel = await trpc.instructRefuel.mutate({
                shipSymbol: Registry.selected.symbol
            })
            Registry.shipData[refuel.symbol] = refuel
            await updateCredits()
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship') {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            return selectedShip.fuelAvailable < selectedShip.fuelCapacity && selectedShip.navStatus === 'DOCKED'
        }
        return false
    }
}, {
    name: 'Dock',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected) {
            const dock = await trpc.instructDock.mutate({
                shipSymbol: Registry.selected.symbol
            })
            console.log('dockresult', dock)
            Registry.shipData[dock.symbol] = dock
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship') {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            return selectedShip.navStatus === 'IN_ORBIT' || (selectedShip.navStatus === 'IN_TRANSIT' && new Date(selectedShip.arrivalOn).getTime() < Date.now())
        }
        return false
    }
}, {
    name: 'Orbit',
    action:  async (event) => {
        event.stopPropagation();
        if (Registry.selected) {
            const orbit = await trpc.instructOrbit.mutate({
                shipSymbol: Registry.selected.symbol
            })
            Registry.shipData[orbit.symbol] = orbit
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship') {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            return selectedShip.navStatus === 'DOCKED'
        }
        return false
    }
}, {
    name: 'Extract',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected) {
            const shipInfo = await trpc.instructExtract.mutate({
                shipSymbol: Registry.selected.symbol
            })
            Registry.shipData[shipInfo.symbol] = shipInfo
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship' && Registry.waypointData) {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            if (Registry.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'IN_ORBIT' && Registry.waypointData[selectedShip.currentWaypoint.symbol].traits.filter(t => t.symbol === 'COMMON_METAL_DEPOSITS' || t.symbol === 'MINERAL_DEPOSITS' || t.symbol === 'PRECIOUS_METAL_DEPOSITS').length > 0 && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime()
            }
        }
        return false
    }
}, {
    name: 'Sell All',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected) {
            const shipInfo = await trpc.instructSellCargo.mutate({
                shipSymbol: Registry.selected.symbol
            })
            Registry.shipData[shipInfo.symbol] = shipInfo
            await updateCredits()
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship' && Registry.waypointData) {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            if (Registry.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && selectedShip.cargoUsed > 0
            }
        }
        return false
    }
}, {
    name: 'Chart',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected) {
            const chartResult = await trpc.instructChart.mutate({
                shipSymbol: Registry.selected.symbol
            })
            Registry.shipData[chartResult.ship.symbol] = chartResult.ship
            Registry.waypointData[chartResult.waypoint.symbol] = chartResult.waypoint
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship' && Registry.waypointData) {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            if (Registry.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'IN_ORBIT' && !Registry.waypointData[selectedShip.currentWaypoint.symbol].chartSubmittedBy
            }
        }
        return false
    }
}, {
    name: 'Scan Wpt',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected && Registry.currentSystem) {
            const waypoints = await trpc.instructScanWaypoints.mutate({
                shipSymbol: Registry.selected.symbol
            })
            Registry.shipData[waypoints.symbol] = waypoints
            await loadSystem(Registry.currentSystem)
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship') {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            return selectedShip.navStatus === 'IN_ORBIT' && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime()
        }
        return false
    }
}, {
    name: 'Scan Shp',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected && Registry.currentSystem) {
            const waypoints = await trpc.instructScanShips.mutate({
                shipSymbol: Registry.selected.symbol
            })
            Registry.shipData[waypoints.symbol] = waypoints
            await loadSystem(Registry.currentSystem)
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship') {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            return selectedShip.navStatus === 'IN_ORBIT' && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime() && selectedShip.mounts.filter(m => m.effectName === 'SENSOR_ARRAY').length > 0
        }
        return false
    }
}, {
    name: 'Market',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected && Registry.currentSystem) {
            const market = await trpc.instructMarket.mutate({
                shipSymbol: Registry.selected.symbol,
                systemSymbol: Registry.currentSystem,
                waypointSymbol: Registry.shipData[Registry.selected.symbol].currentWaypoint.symbol
            })

            // open market dialog
            console.log(market)
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'ship' && Registry.waypointData) {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            if (Registry.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && Registry.waypointData[selectedShip.currentWaypoint.symbol].traits.filter(t => t.symbol === 'MARKETPLACE').length > 0
            }
        }
        return false
    }
}, {
    name: 'Shipyard',
    action: async (event) => {
        event.stopPropagation();
        console.log("click  shy")
        if (Registry.selected && Registry.currentSystem) {
            const waypointSymbol = Registry.selected?.type === 'waypoint' ? Registry.selected.symbol : Registry.shipData[Registry.selected.symbol].currentWaypoint.symbol

            const market = await trpc.instructShipyard.mutate({
                shipSymbol: Registry.selected.symbol,
                systemSymbol: Registry.currentSystem,
                waypointSymbol
            })

            // open market dialog
            console.log(market)
            const shipyardData = await trpc.getShipyard.query({
                waypointSymbol
            })
            const shipyardWindow = new ShipyardWindow(shipyardData, Registry.selected.type === 'waypoint')

            uiOverlay.addChild(shipyardWindow.container.displayObject)
            shipyardWindow.container.displayObject.x = (window.innerWidth - 1000) / 2
            shipyardWindow.container.displayObject.y = (window.innerHeight - 600) / 2
            deselectListeners.once('deselect', () => {
                uiOverlay.removeChild(shipyardWindow.container.displayObject)
            })
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'waypoint' && Registry.waypointData) {
            if (Registry.waypointData[Registry.selected.symbol]) {
                return Registry.waypointData[Registry.selected.symbol].traits.filter(t => t.symbol === 'SHIPYARD').length > 0
            }
        }
        if (Registry.selected?.type === 'ship' && Registry.waypointData) {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            if (Registry.waypointData[selectedShip.currentWaypoint.symbol]) {
                return selectedShip.navStatus === 'DOCKED' && Registry.waypointData[selectedShip.currentWaypoint.symbol].traits.filter(t => t.symbol === 'SHIPYARD').length > 0
            }
        }
        return false
    }
}, {
    name: 'Jumpgate',
    action: async (event) => {
        event.stopPropagation();
        if (Registry.selected && Registry.currentSystem) {
            let waypointSymbol;
            if (Registry.selected.type == 'ship') {
                waypointSymbol = Registry.shipData[Registry.selected.symbol].currentWaypoint.symbol
            } else {
                waypointSymbol = Registry.selected.symbol
            }
            const jumpgateInfo = await trpc.instructJumpGate.mutate({
                shipSymbol: Registry.selected.symbol,
                systemSymbol: Registry.currentSystem,
                waypointSymbol: waypointSymbol
            })

            // open market dialog
            console.log(jumpgateInfo)
        }
    },
    isAvailable: () => {
        if (Registry.selected?.type === 'waypoint') {
            return Registry.waypointData[Registry.selected.symbol].type === 'JUMP_GATE'
        }
        if (Registry.selected?.type === 'ship' && Registry.waypointData) {
            const selectedShip = Registry.shipData[Registry.selected.symbol]
            if (Registry.waypointData[selectedShip.currentWaypoint.symbol]) {
                return Registry.waypointData[selectedShip.currentWaypoint.symbol].type === 'JUMP_GATE'
            }
        }
        return false
    }
}, {
    name: 'Behavior',
    action: async (event) => {
        event.stopPropagation();
        behaviorWindow.show()
        behaviorWindow.setHome(Registry.shipData[Registry.selected.symbol].currentSystemSymbol)
        deselectListeners.once('deselect', () => {
            behaviorWindow.hide()
        })
    },
    isAvailable: () => {
        return Registry.selected?.type === 'ship'
    }
}]
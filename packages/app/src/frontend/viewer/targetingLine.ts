import {Registry} from "@front/viewer/registry";
import {systemGraphics, systemGraphicsText, universeGraphics, universeGraphicsText} from "@front/viewer/UIElements";
import {scale} from "@front/viewer/consts";


export const clearGraphics = () => {
    universeGraphics.clear()
    systemGraphics.clear()
    universeGraphicsText.text = ""
    systemGraphicsText.text = ""
}

const warpColor = 0x4487DD;
const jumpColor = 0x999933;

export const universeTargetingLine = (sizeMultiplier: number) => {
    if (Registry.hoveredSystem && Registry.currentView == 'universe' && Registry.selected?.type === 'ship') {
        const selectedShip = Registry.shipData[Registry.selected?.symbol]
        const warpRange = selectedShip.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
        const jumpRange = selectedShip.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value

        const jumpGateRange = Registry.waypointData[selectedShip.currentWaypoint.symbol]?.jumpgate?.range

        const currentSystemSymbol = Registry.shipData[Registry.selected.symbol].currentWaypoint.systemSymbol
        const hoveredSystemSymbol = Registry.hoveredSystem.symbol

        const fromContainer = Registry.systems[currentSystemSymbol]
        const toContainer = Registry.systems[hoveredSystemSymbol]

        if (!fromContainer || !toContainer) return;

        const fromData = Registry.systemData[currentSystemSymbol]
        const toData = Registry.systemData[hoveredSystemSymbol]

        const distance = Math.round(Math.sqrt(Math.pow(fromData.x - toData.x, 2)+Math.pow(fromData.y - toData.y, 2)))

        if (jumpRange && distance < (jumpGateRange ?? jumpRange)) {
            universeGraphics.stroke({
                color: jumpColor,
                width: sizeMultiplier
            })
        } else if (warpRange && distance < warpRange) {
            universeGraphics.stroke({
                color: warpColor,
                width: sizeMultiplier
            })
        } else {
            universeGraphics.stroke({
                color: 0xFF0000,
                width: sizeMultiplier
            })
        }

        universeGraphics.moveTo(fromContainer.x, fromContainer.y)
        universeGraphics.lineTo(toContainer.x, toContainer.y)

        universeGraphicsText.x = (fromContainer.x + toContainer.x) / 2
        universeGraphicsText.y = (fromContainer.y + toContainer.y) / 2 + 120
        universeGraphicsText.text = `Distance ${distance}`
        universeGraphicsText.scale = {x: sizeMultiplier, y: sizeMultiplier}
    }
    if (Registry.currentView === 'universe' && Registry.selected?.type === 'ship') {

        const currentSystemSymbol = Registry.shipData[Registry.selected.symbol].currentWaypoint.systemSymbol
        const fromContainer = Registry.systems[currentSystemSymbol]

        const selectedShip = Registry.shipData[Registry.selected?.symbol]
        const warpRange = selectedShip.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
        const jumpRange = selectedShip.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value

        const jumpGateRange = Registry.waypointData[selectedShip.currentWaypoint.symbol]?.jumpgate?.range

        console.log("jumpgate range", jumpGateRange)

        if (warpRange) {
            universeGraphics.stroke({
                color: warpColor,
                width: sizeMultiplier
            })
            universeGraphics.circle(fromContainer.x, fromContainer.y, warpRange*scale.universe)
        }
        if (jumpRange || jumpGateRange) {
            universeGraphics.stroke({
                color: jumpColor,
                width: sizeMultiplier
            })
            universeGraphics.circle(fromContainer.x, fromContainer.y, (jumpGateRange ?? jumpRange)*scale.universe)
        }
    }
}

export const systemTargetingLine = () => {
    if (Registry.hoveredWaypoint && Registry.selected?.type === 'ship' && Registry.hoveredWaypoint.symbol !== Registry.shipData[Registry.selected.symbol].currentWaypoint.symbol) {
        console.log('shiptargeting')
        systemGraphics.clear()
        systemGraphics.stroke({
            color: 0x5533FF,
            width: 10
        })

        const currentWaypointSymbol = Registry.shipData[Registry.selected.symbol].currentWaypoint.symbol
        const hoveredWaypointSymbol = Registry.hoveredWaypoint.symbol

        const fromContainer = Registry.waypoints[currentWaypointSymbol]
        const toContainer = Registry.waypoints[hoveredWaypointSymbol]

        if (!fromContainer || !toContainer) return;

        systemGraphics.moveTo(fromContainer.x, fromContainer.y)
        systemGraphics.lineTo(toContainer.x, toContainer.y)

        const fromData = Registry.waypointData[currentWaypointSymbol]
        const toData = Registry.waypointData[hoveredWaypointSymbol]

        systemGraphicsText.x = (toContainer.x - fromContainer.x) / 2
        systemGraphicsText.y = (toContainer.y - fromContainer.y) / 2 + 120
        systemGraphicsText.text = `Distance ${Math.round(Math.sqrt(Math.pow(fromData.x - toData.x, 2)+Math.pow(fromData.y - toData.y, 2)))}`
    }
}
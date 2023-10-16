import {GameState} from "@front/game/game-state";
import {systemGraphics, systemGraphicsText, universeGraphics, universeGraphicsText} from "@front/game/UIElements";
import {scale} from "@front/game/consts";


export const clearGraphics = () => {
    universeGraphics.clear()
    systemGraphics.clear()
    universeGraphicsText.text = ""
    systemGraphicsText.text = ""
}

const warpColor = 0x4487DD;
const jumpColor = 0x999933;

export const universeTargetingLine = (sizeMultiplier: number) => {
    if (GameState.hoveredSystem && GameState.currentView == 'universe' && GameState.selected?.type === 'ship') {
        const selectedShip = GameState.shipData[GameState.selected?.symbol]
        const warpRange = selectedShip.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
        const jumpRange = selectedShip.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value

        const jumpGateRange = GameState.waypointData[selectedShip.currentWaypoint.symbol]?.jumpgate?.range

        const currentSystemSymbol = GameState.shipData[GameState.selected.symbol].currentWaypoint.systemSymbol
        const hoveredSystemSymbol = GameState.hoveredSystem.symbol

        const fromContainer = GameState.systems[currentSystemSymbol]
        const toContainer = GameState.systems[hoveredSystemSymbol]

        if (!fromContainer || !toContainer) return;

        const fromData = GameState.systemData[currentSystemSymbol]
        const toData = GameState.systemData[hoveredSystemSymbol]

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
    if (GameState.currentView === 'universe' && GameState.selected?.type === 'ship') {

        const currentSystemSymbol = GameState.shipData[GameState.selected.symbol].currentWaypoint.systemSymbol
        const fromContainer = GameState.systems[currentSystemSymbol]

        const selectedShip = GameState.shipData[GameState.selected?.symbol]
        const warpRange = selectedShip.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
        const jumpRange = selectedShip.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value

        const jumpGateRange = GameState.waypointData[selectedShip.currentWaypoint.symbol]?.jumpgate?.range

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
    if (GameState.hoveredWaypoint && GameState.selected?.type === 'ship' && GameState.hoveredWaypoint.symbol !== GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol) {
        console.log('shiptargeting')
        systemGraphics.clear()
        systemGraphics.stroke({
            color: 0x5533FF,
            width: 10
        })

        const currentWaypointSymbol = GameState.shipData[GameState.selected.symbol].currentWaypoint.symbol
        const hoveredWaypointSymbol = GameState.hoveredWaypoint.symbol

        const fromContainer = GameState.waypoints[currentWaypointSymbol]
        const toContainer = GameState.waypoints[hoveredWaypointSymbol]

        if (!fromContainer || !toContainer) return;

        systemGraphics.moveTo(fromContainer.x, fromContainer.y)
        systemGraphics.lineTo(toContainer.x, toContainer.y)

        const fromData = GameState.waypointData[currentWaypointSymbol]
        const toData = GameState.waypointData[hoveredWaypointSymbol]

        systemGraphicsText.x = (toContainer.x - fromContainer.x) / 2
        systemGraphicsText.y = (toContainer.y - fromContainer.y) / 2 + 120
        systemGraphicsText.text = `Distance ${Math.round(Math.sqrt(Math.pow(fromData.x - toData.x, 2)+Math.pow(fromData.y - toData.y, 2)))}`
    }
}
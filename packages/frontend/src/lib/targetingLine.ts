import {GameState} from "@app/lib/game-state";
import {systemGraphics, systemGraphicsText, universeGraphics, universeGraphicsText} from "@app/lib/UIElements";
import {scale} from "@app/lib/consts";


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
        const warpRange = GameState.myShips[GameState.selected?.symbol].shipData.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
        const jumpRange = GameState.myShips[GameState.selected?.symbol].shipData.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value

        const currentSystemSymbol = GameState.myShips[GameState.selected.symbol].shipData.currentWaypoint.systemSymbol
        const hoveredSystemSymbol = GameState.hoveredSystem.symbol

        const fromContainer = GameState.visibleSystems[currentSystemSymbol].container
        const toContainer = GameState.visibleSystems[hoveredSystemSymbol].container

        const fromData = GameState.visibleSystems[currentSystemSymbol].systemData
        const toData = GameState.visibleSystems[hoveredSystemSymbol].systemData

        const distance = Math.round(Math.sqrt(Math.pow(fromData.x - toData.x, 2)+Math.pow(fromData.y - toData.y, 2)))

        if (jumpRange && distance < jumpRange) {
            universeGraphics.lineStyle({
                color: jumpColor,
                width: sizeMultiplier
            })
        } else if (warpRange && distance < warpRange) {
            universeGraphics.lineStyle({
                color: warpColor,
                width: sizeMultiplier
            })
        } else {
            universeGraphics.lineStyle({
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

        const currentSystemSymbol = GameState.myShips[GameState.selected.symbol].shipData.currentWaypoint.systemSymbol
        const fromContainer = GameState.visibleSystems[currentSystemSymbol].container

        const warpRange = GameState.myShips[GameState.selected?.symbol].shipData.modules.find(m => m.effectName === 'WARP_DRIVE')?.value
        const jumpRange = GameState.myShips[GameState.selected?.symbol].shipData.modules.find(m => m.effectName === 'JUMP_DRIVE')?.value

        if (warpRange) {
            universeGraphics.lineStyle({
                color: warpColor,
                width: sizeMultiplier
            })
            universeGraphics.drawCircle(fromContainer.x, fromContainer.y, warpRange*scale.universe)
        }
        if (jumpRange) {
            universeGraphics.lineStyle({
                color: jumpColor,
                width: sizeMultiplier
            })
            universeGraphics.drawCircle(fromContainer.x, fromContainer.y, jumpRange*scale.universe)
        }
    }
}

export const systemTargetingLine = () => {
    if (GameState.hoveredWaypoint && GameState.selected?.type === 'ship' && GameState.hoveredWaypoint.symbol !== GameState.myShips[GameState.selected.symbol].shipData.currentWaypoint.symbol) {
        console.log('shiptargeting')
        systemGraphics.clear()
        systemGraphics.lineStyle({
            color: 0x5533FF,
            width: 10
        })

        const currentWaypointSymbol = GameState.myShips[GameState.selected.symbol].shipData.currentWaypoint.symbol
        const hoveredWaypointSymbol = GameState.hoveredWaypoint.symbol

        const fromContainer = GameState.visibleWaypoints[currentWaypointSymbol].container
        const toContainer = GameState.visibleWaypoints[hoveredWaypointSymbol].container

        systemGraphics.moveTo(fromContainer.x, fromContainer.y)
        systemGraphics.lineTo(toContainer.x, toContainer.y)

        const fromData = GameState.visibleWaypoints[currentWaypointSymbol].waypointData
        const toData = GameState.visibleWaypoints[hoveredWaypointSymbol].waypointData

        systemGraphicsText.x = (toContainer.x - fromContainer.x) / 2
        systemGraphicsText.y = (toContainer.y - fromContainer.y) / 2 + 120
        systemGraphicsText.text = `Distance ${Math.round(Math.sqrt(Math.pow(fromData.x - toData.x, 2)+Math.pow(fromData.y - toData.y, 2)))}`
    }
}
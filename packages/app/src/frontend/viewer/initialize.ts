import {loadAssets} from "@front/viewer/assets";
import {Application, Text, Ticker} from "pixi.js";
import {createUIElements, starLayer, universeView} from "@front/viewer/UIElements";
import {
  hideStar,
  hideUnverseJumpGraphics,
  loadUniverse, renderUniverseJumpGraphics,
  showStar,
  showUnverseJumpGraphics, universeJumpGraphics
} from "@front/viewer/loadUniverse";
import {loadPlayerData} from "@front/viewer/loadPlayerData";
import {Registry} from "@front/viewer/registry";
import {loadSystem, unloadSystem} from "@front/viewer/loadSystem";
import {backgroundGraphicsScale, mapScale, systemDistanceMultiplier} from "@front/viewer/consts";
import {countShipWaypoints, positionShip, positionShips, resetShipWaypoints} from "@front/viewer/positionShips";
import { trpc } from "@front/trpc";
import {UniverseEntity} from "@front/viewer/universe-entity";
import {contextMenuActions} from "@front/ui/slices/context-menu";
import {store} from "@front/ui/store";
import {agentActions} from "@front/ui/slices/agent";
import {shipActions} from "@front/ui/slices/ship";

let mapmoveTimeout: NodeJS.Timeout | undefined
const windowOffset = 40
export const handleMapMove = () => {
  if (mapmoveTimeout) {
    clearTimeout(mapmoveTimeout)
  }
  mapmoveTimeout = setTimeout(() => {
    const zoom = universeView.worldScreenWidth / universeView.screenWidth

    const startMapMove = Date.now();
    let showDetailedSystems = false
    let starDisplay: 'graphics' | 'textures'

    if (zoom > 3000) {
      starDisplay = 'graphics'
      showDetailedSystems = false
    } else if (zoom <= 3000 && zoom > 40) {
      starDisplay = 'textures'
      showDetailedSystems = false
    } else {
      starDisplay = 'textures'
      showDetailedSystems = true
    }

    if (showDetailedSystems) {
      console.log(`checking systems between x ${universeView.worldTransform.tx} and ${universeView.worldTransform.tx + universeView.worldScreenWidth}, y ${universeView.worldTransform.ty} and ${universeView.worldTransform.ty + universeView.worldScreenHeight}`)
      const allInRange = []
      for (const system of Object.values(Registry.systemData)) {
        if (system.x < universeView.right / mapScale / systemDistanceMultiplier + windowOffset && system.x > universeView.left / mapScale / systemDistanceMultiplier - windowOffset && system.y < universeView.bottom / mapScale / systemDistanceMultiplier + windowOffset && system.y > universeView.top / mapScale / systemDistanceMultiplier - 800) {
          allInRange.push(system.symbol)
          showStar(system.symbol)
          loadSystem(system.symbol)
        }
      }
      console.log("all in range", allInRange)
      for (const systemKey of Object.keys(Registry.transformedSystems)) {
        if (allInRange.indexOf(systemKey) === -1) {
          console.log('supposed to unload', systemKey)
          unloadSystem(systemKey)
        }
      }
      hideUnverseJumpGraphics()
    } else {
      console.log(`zoomed out too far to load systems, just show stars`)
      for (const systemKey of Object.keys(Registry.transformedSystems)) {
        if (Registry.transformedSystems[systemKey]) {
          console.log('supposed to unload', systemKey)
          unloadSystem(systemKey)
        }
      }
      showUnverseJumpGraphics()

      for (const system of Object.values(Registry.systemData)) {
        if (starDisplay === 'textures' && system.x < universeView.right / mapScale / systemDistanceMultiplier && system.x > universeView.left / mapScale / systemDistanceMultiplier && system.y < universeView.bottom / mapScale / systemDistanceMultiplier && system.y > universeView.top / mapScale / systemDistanceMultiplier) {
          showStar(system.symbol)
          // const starEntity = Registry.systems[system.symbol]
          // if (starEntity) {
          //   starEntity.displaySimple = starDisplay === 'graphics'
          // }
        } else {
          hideStar(system.symbol)
        }
      }
    }
    console.log(`map move took ${Date.now() - startMapMove}ms`)
  }, 100);
}

export async function initialize(app: Application) {
  await loadPlayerData()
  const loadedUniverse = await loadUniverse()

  const txt = new Text({ text: "hello", style: {
      fill: 0xffffff
    }})
  txt.zIndex = 1000
  Ticker.shared.speed = 2
  app.ticker.minFPS = 40
  app.ticker.maxFPS = 120

  app.stage.addChild(txt);

  app.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  app.stage.interactive = true;
  app.stage.hitArea = app.screen;

  app.stage.on("click", (event) => {
    console.log("deselecting")
    Registry.deselect();
    store.dispatch(contextMenuActions.close())
  })

  // ticker to size universe objects
  app.ticker.add((dat) => {
    const startTime = Date.now()
    const sizeMultiplier = Math.max(Math.min(universeView.worldScreenWidth / universeView.screenWidth, 100), 0.3)
    const systemSizeMultiplier = Math.max(Math.min(universeView.worldScreenWidth / universeView.screenWidth, 5), 0.7)
    const shipSizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth


    if (universeJumpGraphics) {
      universeJumpGraphics.scale = {x: mapScale * systemDistanceMultiplier * backgroundGraphicsScale, y: mapScale * systemDistanceMultiplier*backgroundGraphicsScale}
    }
    for (const ref of Object.values(Registry.systems)) {
      if (ref) {
        ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
      }
    }

    for(const objects of Object.values(Registry.systemObjects)) {
      for(const ref of objects.filter(ref => ref instanceof UniverseEntity)) {
        ref.scale = {x: systemSizeMultiplier, y: systemSizeMultiplier}
      };
    }

    countShipWaypoints()
    const shipPositions = positionShips()
    for (const shipKey of Object.keys(Registry.shipData)) {
      const shipEntity = Registry.universeShips[shipKey]
      const shipData = Registry.shipData[shipKey]

      if (shipEntity) {
        shipEntity.scale = {x: shipSizeMultiplier, y: shipSizeMultiplier}
        const newPos = shipPositions[shipKey]
        shipEntity.position = newPos.position
        shipEntity.setAngle(newPos.navRot ?? 0)
        const arrivalTime = new Date(shipData.arrivalOn ?? 0).getTime()
        const departureTime = new Date(shipData.departureOn ?? 0).getTime()
        const now = new Date().getTime()
        const pathProgress = (now - departureTime) / (arrivalTime - departureTime)
        if (shipData.navStatus === "IN_TRANSIT" && shipData.arrivalOn && arrivalTime > now) {
          shipEntity.setNavigating(true, shipData.flightMode, pathProgress)
        } else {
          shipEntity.setNavigating(false)
          shipEntity.scale = {
            x: Math.max(0.3 * shipSizeMultiplier, 0.3),
            y: Math.max(0.3 * shipSizeMultiplier, 0.3)
          }

        }

        if (shipData.navStatus === 'IN_ORBIT' && shipData.role === 'EXCAVATOR' && ['GAS_GIANT', 'ASTEROID'].includes(shipData.currentWaypoint.type) && shipData.objective) {
          shipEntity.setExtracting(true, shipData.currentWaypoint.type === 'GAS_GIANT' ? 0x99ff44 : 0xff4444)
        } else {
          shipEntity.setExtracting(false)
        }
      }
    }
    const timeRan = Date.now() - startTime
    const zoom = universeView.worldScreenWidth / universeView.screenWidth

    txt.text = `fps: ${dat.FPS.toFixed(0)}, frametime ${timeRan}, strctrobjs ${starLayer.children.length}, zoom: ${zoom.toFixed(2)}`
  })

  console.log("rendering jump graphics")
  renderUniverseJumpGraphics()

  universeView.on('drag-start', () => {
    store.dispatch(contextMenuActions.close())
  })
  // ticker to load system data when zoomed in far enough
  universeView.on('moved', () => {
    handleMapMove()
  })
  handleMapMove()
}
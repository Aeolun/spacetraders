import {loadAssets} from "@front/viewer/assets";
import {Application, Text, Ticker} from "pixi.js";
import {createUIElements, universeView} from "@front/viewer/UIElements";
import {loadUniverse} from "@front/viewer/loadUniverse";
import {loadPlayerData} from "@front/viewer/loadPlayerData";
import {Registry} from "@front/viewer/registry";
import {loadSystem, unloadSystem} from "@front/viewer/loadSystem";
import {mapScale, systemDistanceMultiplier} from "@front/viewer/consts";
import {positionShip, resetShipWaypoints} from "@front/viewer/positionShips";
import { trpc } from "@front/trpc";
import {UniverseEntity} from "@front/viewer/universe-entity";
import {contextMenuActions} from "@front/ui/slices/context-menu";
import {store} from "@front/ui/store";
import {agentActions} from "@front/ui/slices/agent";
import {shipActions} from "@front/ui/slices/ship";

export const handleMapMove = () => {
  const zoom = universeView.worldScreenWidth / universeView.screenWidth

  if (zoom < 40) {
    console.log(`checking systems between x ${universeView.worldTransform.tx} and ${universeView.worldTransform.tx + universeView.worldScreenWidth}, y ${universeView.worldTransform.ty} and ${universeView.worldTransform.ty + universeView.worldScreenHeight}`)
    Object.values(Registry.systemData).forEach(system => {
      if (system.x < universeView.right / mapScale / systemDistanceMultiplier && system.x > universeView.left / mapScale / systemDistanceMultiplier && system.y < universeView.bottom / mapScale / systemDistanceMultiplier && system.y > universeView.top / mapScale / systemDistanceMultiplier) {
        loadSystem(system.symbol)
      }
    });
  } else {
    console.log(`zoomed out too far to load systems`)
    Object.keys(Registry.transformedSystems).forEach(systemKey => {
      if (Registry.transformedSystems[systemKey]) {
        unloadSystem(systemKey)
      }
    });
  }
}

export async function initialize(app: Application) {
  await loadPlayerData()
  const loadedUniverse = await loadUniverse()

  const txt = new Text({ text: "hello", style: {
      fill: 0xffffff
    }})
  txt.zIndex = 1000
  app.ticker.add((ticker) => {
    const zoom = universeView.worldScreenWidth / universeView.screenWidth

    txt.text = `fps: ${ticker.FPS.toFixed(0)}, zoom: ${zoom.toFixed(2)}`
  })
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
    const sizeMultiplier = Math.max(Math.min(universeView.worldScreenWidth / universeView.screenWidth, 50), 0.3)
    const systemSizeMultiplier = Math.max(Math.min(universeView.worldScreenWidth / universeView.screenWidth, 5), 0.3)
    const shipSizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth

    Object.values(loadedUniverse.systems).forEach(ref => {
      ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
    })

    Object.values(Registry.systemObjects).forEach(objects => {
      objects.filter(ref => ref instanceof UniverseEntity).forEach(ref => {
        ref.scale = {x: systemSizeMultiplier, y: systemSizeMultiplier}
      });
    })

    resetShipWaypoints()
    Object.keys(Registry.shipData).forEach(shipKey => {
      const shipEntity = Registry.universeShips[shipKey]
      const shipData = Registry.shipData[shipKey]

      if (shipEntity) {
        shipEntity.scale = {x: shipSizeMultiplier, y: shipSizeMultiplier}
        const newPos = positionShip(shipData)
        shipEntity.position = newPos.position
        shipEntity.setAngle(newPos.navRot ?? 0)
        if (shipData.navStatus === "IN_TRANSIT" && shipData.arrivalOn && new Date(shipData.arrivalOn).getTime() > Date.now()) {
          shipEntity.setNavigating(true)
        } else {
          shipEntity.setNavigating(false)
        }
      }
    });
  })

  universeView.on('drag-start', () => {
    store.dispatch(contextMenuActions.close())
  })
  // ticker to load system data when zoomed in far enough
  universeView.on('moved', () => {
    handleMapMove()
  })
  handleMapMove()
}
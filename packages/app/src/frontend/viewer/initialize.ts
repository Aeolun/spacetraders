import {loadAssets} from "@front/viewer/assets";
import {Application, Text} from "pixi.js";
import {createUIElements, universeView} from "@front/viewer/UIElements";
import {loadUniverse} from "@front/viewer/loadUniverse";
import {loadPlayerData} from "@front/viewer/loadPlayerData";
import {Registry} from "@front/viewer/registry";
import {loadSystem, unloadSystem} from "@front/viewer/loadSystem";
import {mapScale, systemDistanceMultiplier} from "@front/viewer/consts";
import {positionShip, resetShipWaypoints} from "@front/viewer/positionShips";

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
  await loadAssets()
  await createUIElements(app)
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
  })

  // ticker to size universe objects
  app.ticker.add(() => {
    const sizeMultiplier = Math.max(Math.min(universeView.worldScreenWidth / universeView.screenWidth, 50), 1)
    const shipSizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth

    Object.values(loadedUniverse.systems).forEach(ref => {
      ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
    })

    resetShipWaypoints()
    Object.keys(Registry.shipData).forEach(shipKey => {
      const shipEntity = Registry.universeShips[shipKey]
      const shipData = Registry.shipData[shipKey]
      //shipEntity.scale = {x: shipSizeMultiplier, y: shipSizeMultiplier}

      shipEntity.position = positionShip(shipData).position
    });
  })

  // ticker to load system data when zoomed in far enough
  universeView.on('moved', () => {
    handleMapMove()
  })
  handleMapMove()
}
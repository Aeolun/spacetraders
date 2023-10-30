import {loadAssets} from "@front/viewer/assets";
import {Application, Text} from "pixi.js";
import {createUIElements, universeView} from "@front/viewer/UIElements";
import {loadUniverse} from "@front/viewer/loadUniverse";
import {loadPlayerData} from "@front/viewer/loadPlayerData";
import {Registry} from "@front/viewer/registry";
import {loadSystem, unloadSystem} from "@front/viewer/loadSystem";
import {mapScale} from "@front/viewer/consts";

export const handleMapMove = () => {
  const zoom = universeView.worldScreenWidth / universeView.screenWidth

  if (zoom < 30) {
    console.log(`checking systems between x ${universeView.worldTransform.tx} and ${universeView.worldTransform.tx + universeView.worldScreenWidth}, y ${universeView.worldTransform.ty} and ${universeView.worldTransform.ty + universeView.worldScreenHeight}`)
    Object.values(Registry.systemData).forEach(system => {
      if (system.x < universeView.right / mapScale && system.x > universeView.left / mapScale && system.y < universeView.bottom / mapScale && system.y > universeView.top / mapScale) {
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
    const sizeMultiplier = Math.min(universeView.worldScreenWidth / universeView.screenWidth, 30)
    const shipSizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth

    Object.values(loadedUniverse.systems).forEach(ref => {
      ref.scale = {x: sizeMultiplier, y: sizeMultiplier}
    })

    Object.keys(Registry.universeShips).forEach(shipKey => {
      const ship = Registry.universeShips[shipKey]
      ship.scale = {x: shipSizeMultiplier, y: shipSizeMultiplier}
    });
  })

  // ticker to load system data when zoomed in far enough
  universeView.on('moved', () => {
    handleMapMove()
  })
  handleMapMove()
}
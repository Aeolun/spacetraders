import {Container, Container as UIContainer} from "@front/game/ui-elements/container";
import {BaseButton} from "@front/game/base-elements/base-button";
import {GameState} from "@front/game/game-state";
import {BitmapText, NineSlicePlane} from "pixi.js";
import {loadedAssets} from "@front/game/assets";
import {Switch} from "@front/game/switch";
import {trpc} from "@front/trpc";

import {createActionButtons, createHighlightButtons} from "@front/game/ui/action-buttons";
import {Button} from "@front/game/ui-elements/button";
import {Text} from "@front/game/ui-elements/text";
import {systemView, universeView} from "@front/game/UIElements";
import {gameHeight} from "@front/game/consts";
import {app} from "@front/game/application";


export let credits: Text
export let cruiseModeSelect: Switch

export let entityInfo: Text
export let backButton: Button
export const createSidebar = () => {
  const sidebarContainer = new UIContainer()
  sidebarContainer.height = gameHeight
  sidebarContainer.width = 400
  sidebarContainer.displayObject.x = 0
  sidebarContainer.displayObject.y = 0
  sidebarContainer.padding = 10

  backButton = new Button('Back', {
    height: 64,
    width: 368
  }, (event) => {
    event.stopPropagation();
    universeView.visible = true
    systemView.visible = false
    GameState.currentView = 'universe'
    systemView.removeChildren()
    backButton.disabled = true
  })
  backButton.minHeight = 60
  backButton.disabled = true
  sidebarContainer.addChild(backButton)


  const creditsBackground = new UIContainer({
    variant: 'custom',
    texture: loadedAssets.statsBlock
  })
  creditsBackground.width = '100%'
  creditsBackground.minHeight = 100
  creditsBackground.padding = 8

  sidebarContainer.addChild(creditsBackground)
  const creditsLabel = new Text('Credits', {
    font: {
      fontName: 'buttontext_white',
      tint: 0x00FF00,
      fontSize: 16
    },
    align: 'left'
  })
  creditsLabel.height = 40
  creditsBackground.addChild(creditsLabel)
  credits = new Text('0', {
    font: {
      fontName: 'segment',
      fontSize: 36,
      tint: 0x00FF00
    },
    align: 'left',
  })
  creditsBackground.addChild(credits)



  const cruiseModeButtons = ['CRUISE', 'DRIFT', 'BURN', 'STEALTH']
  cruiseModeSelect = new Switch(cruiseModeButtons, {
    width: 368,
    textSize: 14,
    defaultSelected: 'CRUISE',
  }, async (event, selectedOption) => {
    if (GameState.selected?.type === 'ship') {
      const newShip = await trpc.instructPatchNavigate.mutate({
        shipSymbol: GameState.selected?.symbol,
        navMode: selectedOption
      })
      console.log('new state', newShip)
      GameState.shipData[GameState.selected.symbol] = newShip
    }
  })

  sidebarContainer.addChild(cruiseModeSelect)

  const actionButtons = createActionButtons()
  sidebarContainer.addChild(actionButtons)

  const statsBlock = new UIContainer({
    variant: 'custom',
    texture: loadedAssets.statsBlock
  })
  statsBlock.paddingVertical = 24
  statsBlock.paddingHorizontal = 8
  statsBlock.width = '100%'
  statsBlock.height = 200
  sidebarContainer.addChild(statsBlock)

  entityInfo = new Text('Entity Information', {
    font: {
      fontName: 'buttontext_white',
      fontSize: 16,
      align: 'left',
      maxWidth: 368,
      tint: 0x00CC00,
    },
    align: 'left',
  })

  statsBlock.addChild(entityInfo)

  const cargo = new UIContainer({
    variant: 'default',
  })
  cargo.padding = 16
  cargo.height = 100
  const cargoInfo = new Text('Cargo', {
    font: {
      fontName: 'buttontext_white',
      fontSize: 16,
      align: 'left',
      maxWidth: 368,
      tint: 0x00CC00,
    },
    align: 'left',
  })
  cargo.addChild(cargoInfo)
  app.ticker.add(() => {
    if (GameState.selected && GameState.selected.type === 'ship') {
      const shipData = GameState.shipData[GameState.selected.symbol]
      if (shipData.cargo) {
        cargoInfo.displayObject.bitmapText.text = `Cargo:\n${shipData.cargo.map((cargo) => `- ${cargo.tradeGoodSymbol} ${cargo.units}`).join('\n')}`
      } else {
        cargoInfo.displayObject.bitmapText.text = `Cargo: No data\n`
      }
    } else {
      cargoInfo.displayObject.bitmapText.text = `Cargo:\n`
    }
  })
  sidebarContainer.addChild(cargo)

  const highlightButtons = createHighlightButtons()
  sidebarContainer.addChild(highlightButtons)





  sidebarContainer.updateLayout()


  return sidebarContainer
}
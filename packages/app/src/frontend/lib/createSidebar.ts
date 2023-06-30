import {Container, Container as UIContainer} from "@front/lib/ui-elements/container";
import {BaseButton} from "@front/lib/base-elements/base-button";
import {GameState} from "@front/lib/game-state";
import {BitmapText, NineSlicePlane} from "pixi.js";
import {loadedAssets} from "@front/lib/assets";
import {Switch} from "@front/lib/switch";
import {trpc} from "@front/lib/trpc";

import {createActionButtons, createHighlightButtons} from "@front/lib/ui/action-buttons";
import {Button} from "@front/lib/ui-elements/button";
import {Text} from "@front/lib/ui-elements/text";
import {systemView, universeView} from "@front/lib/UIElements";
import {gameHeight} from "@front/lib/consts";


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

  const highlightButtons = createHighlightButtons()
  sidebarContainer.addChild(highlightButtons)

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
  sidebarContainer.updateLayout()


  return sidebarContainer
}
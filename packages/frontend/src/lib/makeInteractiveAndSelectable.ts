import {Container, DisplayObject} from "pixi.js";
import {GlowFilter} from "@pixi/filter-glow";
import {EventEmitter} from "@pixi/utils";
import {GameState, SelectedType} from "@app/lib/game-state";

export const deselectListeners = new EventEmitter()

export function makeInteractiveAndSelectable(item: DisplayObject, options?: {
    onMouseOver?: () => void,
    onMouseOut?: () => void,
    onSelect?: GameState['selected'],
    onOrder?: {
        name: string,
        withSelection?: SelectedType
        action: (selectedSymbol: string) => void
    }[] | (() => {
        name: string,
        withSelection?: SelectedType
        action: (selectedSymbol: string) => void
    }[])
    }) {
    item.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    item.cursor = 'pointer';
    item.on('mouseover', () => {
        //star.alpha = 0.5
        item.filters = [new GlowFilter()]
        options?.onMouseOver?.()
    })
    const removeGlow = () => {
        //star.alpha = 1
        item.filters = []
    }
    item.on('mouseout', removeGlow)
    item.on('mouseout', () => {
        options?.onMouseOut?.()
    })
    if (options?.onOrder) {
        item.on('rightclick', (event) => {
            event.stopPropagation()

            const validCommands = options.onOrder.filter(c => {
                if (c.withSelection && (!GameState.selected || GameState.selected.type !== c.withSelection)) {
                    return false
                }
                return true
            })
            if (validCommands.length == 0) {
                // do nothing bro
            } else if (validCommands.length === 1) {
                validCommands[0].action(GameState.selected.symbol)
            } else {
                console.log('not yet implemented')
            }

        })
    }
    if (options?.onSelect) {
        item.on('click', (event) => {
            deselectListeners.emit('deselect')
            event.stopPropagation()
            deselectListeners.once('deselect', () => {
                removeGlow()
                GameState.selected = false
                item.on('mouseout', removeGlow)
            })
            item.off('mouseout', removeGlow)
            GameState.selected = options.onSelect
        })
    }
}
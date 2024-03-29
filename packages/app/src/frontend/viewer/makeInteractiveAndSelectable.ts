import {Container, NineSlicePlane } from "pixi.js";
import {GlowFilter} from "@pixi/filter-glow";
import {Registry, SelectedType} from "@front/viewer/registry";
import {loadedAssets} from "@front/viewer/assets";
import {EventEmitter} from "events";

export const deselectListeners = new EventEmitter()

export interface Command {
    name: string,
    withSelection?: SelectedType
    isAvailable?: () => Promise<boolean>
    action: (selectedSymbol: string) => void
}

export function makeInteractiveAndSelectable(item: Container, options?: {
    onMouseOver?: () => void,
    onMouseOut?: () => void,
    onSelect?: Registry['selected'],
    onOrder?: Command[] | (() => Promise<Command[]>)
    }) {
    item.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    item.cursor = 'pointer';
    item.on('mouseover', () => {
        //star.alpha = 0.5
        item.filters = []
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
        item.on('rightclick', async (event) => {
            event.stopPropagation()

            const allCommands = typeof options.onOrder == 'function' ? await options.onOrder() : options.onOrder
            const filteredCommands = allCommands.filter(c => {
                if (c.withSelection && (!Registry.selected || Registry.selected.type !== c.withSelection)) {
                    return false
                }
                return true
            })

            const isCommandAvailable = await Promise.all(filteredCommands.map(c => {
                return c.isAvailable ? c.isAvailable() : true
            }))
            const validCommands = filteredCommands.filter((c, index) => {
                return isCommandAvailable[index]
            })

            if (validCommands.length == 0) {
                // do nothing bro
            } else if (filteredCommands.length === 1) {
                filteredCommands[0].action(Registry.selected.symbol)
            } else {
                const background = new NineSlicePlane(loadedAssets.statsBlock)
                background.height = filteredCommands.length * 40
                background.width = 180
                // filteredCommands.forEach((comm, index) => {
                //     const button = new BaseButton(comm.name, {
                //         width: 160,
                //         height: 30,
                //         textSize: 16
                //     }, (event) => {
                //         event.stopPropagation();
                //         comm.action(Registry.selected.symbol)
                //         item.removeChild(background)
                //     })
                //     button.x = 10
                //     button.y = 10 + (index * 35)
                //     button.disabled = !isCommandAvailable[index]
                //     background.addChild(button)
                // })
                item.addChild(background)
                deselectListeners.once('deselect', () => {
                    item.removeChild(background)
                })
            }

        })
    }
    if (options?.onSelect) {
        item.on('click', (event) => {
            deselectListeners.emit('deselect')
            event.stopPropagation()
            deselectListeners.once('deselect', () => {
                removeGlow()
                Registry.selected = undefined
                item.on('mouseout', removeGlow)
            })
            item.off('mouseout', removeGlow)
            Registry.selected = options.onSelect
        })
    }
}
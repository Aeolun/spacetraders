import {FlexDirection} from "@front/lib/Flex";
import {Container} from "@front/lib/ui-elements/container";
import {Text} from '@front/lib/ui-elements/text'
import {Button} from "@front/lib/ui-elements/button";
import {trpc} from "@front/lib/trpc";
import {GameState} from "@front/lib/game-state";
import type {ShipBehavior} from "@app/prisma";

export class BehaviorWindow {
    public container: Container

    constructor() {
        this.container = new Container()
        this.container.width = 1920 - 400
        this.container.height = 600
        this.container.flexDirection = FlexDirection.COLUMN
        this.container.padding = 10

        this.container.updateLayout()
    }

    public setBehaviors(behaviors: { symbol: string, name: string, description: string }[]) {
        behaviors.forEach(behavior => {
            const row = new Container()
            row.flex = 1
            row.flexDirection = FlexDirection.ROW

            const texts = [behavior.symbol, behavior.name, behavior.description]
            texts.forEach(textString => {
                const text = new Text(textString, {
                    align: "left",
                    font: {
                        fontName: 'buttontext_white',
                        fontSize: 16,
                    },
                })
                text.flex = 1
                row.addChild(text)
            })

            const button = new Button('Activate', {
                textSize: 16
            }, () => {
                trpc.startBehaviorForShip.mutate({ shipSymbol: GameState.selected.symbol, behavior: behavior.symbol as ShipBehavior, parameters: {
                    systemSymbol: GameState.shipData[GameState.selected.symbol].currentSystemSymbol,
                    range: 5000
                }}).then(() => {
                    alert("Behavior started")
                    this.hide()
                })
            })
            button.flex = 1
            row.addChild(button)
            this.container.addChild(row)
        })

        this.container.updateLayout()
    }

    public show() {
        this.container.displayObject.visible = true
        this.container.displayObject.x = 200
        this.container.displayObject.y = 200
    }

    public hide() {
        this.container.displayObject.visible = false
    }
}
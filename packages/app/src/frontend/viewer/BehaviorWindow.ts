import {FlexDirection} from "@front/viewer/Flex";
import {Container} from "@front/viewer/ui-elements/container";
import {Text} from '@front/viewer/ui-elements/text'
import {Button} from "@front/viewer/ui-elements/button";
import {trpc} from "@front/trpc";
import {Registry} from "@front/viewer/registry";
import type {ShipBehavior} from "@backend/prisma";
import {Switch} from "@front/viewer/switch";
import {gameWidth} from "@front/viewer/consts";

export class BehaviorWindow {
    public container: Container
    private selectedRange = 1500
    private homeSystem: string = ''
    private switchRange: Switch
    private homeSystemText: Text

    constructor() {
        this.container = new Container()
        this.container.width = gameWidth - 400
        this.container.height = 600
        this.container.flexDirection = FlexDirection.COLUMN
        this.container.padding = 10

        this.container.updateLayout()
    }

    public setHome(homeSystem: string) {
        this.homeSystem = homeSystem
        this.homeSystemText.displayObject.bitmapText.text = `Home: ${homeSystem}`
    }

    public setBehaviors(behaviors: { symbol: string, name: string, description: string }[]) {
        const header = new Container()
        header.width = '100%'
        header.height = 140
        header.flexDirection = FlexDirection.COLUMN
        this.container.addChild(header)

        this.homeSystemText = new Text('Home', {
            align: "left",
            font: {
                fontName: 'buttontext_white',
                fontSize: 24
            }
        })
        this.homeSystemText.marginVertical = 10
        this.homeSystemText.width="100%"
        this.homeSystemText.height=30
        this.homeSystemText.paddingVertical = 6
        header.addChild(this.homeSystemText)

        const headerText = new Text('Range', {
            align: "left",
            font: {
                fontName: 'buttontext_white',
                fontSize: 16
            }
        })
        headerText.width="100%"
        headerText.height=20
        header.addChild(headerText)

        this.switchRange = new Switch(['1500', '2500', '3500', '5000'], {
            width: 100,
            defaultSelected: '1500'
        }, (event, value) => {
            this.selectedRange = parseInt(value)
        })
        header.addChild(this.switchRange)

        const behaviorsContainer = new Container()
        behaviorsContainer.flex = 1
        this.container.addChild(behaviorsContainer);
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
                trpc.startBehaviorForShip.mutate({ shipSymbol: Registry.selected.symbol, behavior: behavior.symbol as ShipBehavior, parameters: {
                    systemSymbol: this.homeSystem,
                    range: this.selectedRange
                }}).then(() => {
                    alert("Behavior started")
                    this.hide()
                })
            })
            button.flex = 1
            row.addChild(button)
            behaviorsContainer.addChild(row)
        })
        const row = new Container()
        row.flex = 1
        row.flexDirection = FlexDirection.ROW
        const button = new Button('Cancel', {
            textSize: 16
        }, () => {
            trpc.cancelBehaviorForShip.mutate({ shipSymbol: Registry.selected.symbol }).then(() => {
                alert("Behavior canceled")
            });
            this.hide()
        })
        button.flex = 1
        row.addChild(button)
        behaviorsContainer.addChild(row)

        this.container.updateLayout()
    }

    public show() {
        this.selectedRange = 1500
        this.switchRange.selectedValue = '1500'
        this.container.displayObject.visible = true
        this.container.displayObject.x = 200
        this.container.displayObject.y = 200
    }

    public hide() {
        this.container.displayObject.visible = false
    }
}
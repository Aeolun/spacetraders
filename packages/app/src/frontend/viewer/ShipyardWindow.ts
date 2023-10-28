import type {ShipConfiguration, ShipyardModel, ShipConfigurationMount, ShipConfigurationModule} from '@backend/prisma'
import {FlexDirection} from "@front/viewer/Flex";
import {trpc} from "@front/trpc";
import {loadSystem} from "@front/viewer/loadSystem";
import {Registry} from "@front/viewer/registry";
import {Text} from "@front/viewer/ui-elements/text";
import {Container} from '@front/viewer/ui-elements/container'
import {Button} from "@front/viewer/ui-elements/button";
import {updateCredits} from "@front/viewer/loadPlayerData";


type ExpectedData = (ShipyardModel & { shipConfiguration: ShipConfiguration & { shipConfigurationMount: ShipConfigurationMount[], shipConfigurationModule: ShipConfigurationModule[] }})
export class ShipyardWindow {
    public container: Container

    constructor(ships: ExpectedData[], private readonly: boolean = false) {
        this.container = new Container()
        this.container.width = 1000
        this.container.height = 600

        ships.forEach(ship => {
            this.addGood(ship)
        })

        this.container.updateLayout()
    }

    addGood(ship: ExpectedData) {
        const flexRow = new Container()

        flexRow.flexDirection = FlexDirection.COLUMN
        flexRow.height = 80
        flexRow.width = '100%'

        const firstRow = new Container({ variant: 'invisible' })
        firstRow.height = 40
        firstRow.width = '100%'
        firstRow.flexDirection = FlexDirection.ROW

        const secondRow = new Container({ variant: 'invisible' })
        secondRow.height = 40
        secondRow.width = '100%'
        secondRow.flexDirection = FlexDirection.ROW

        const fontStyle = {
            fontName: 'buttontext_white',
            fontSize: 12
        }

        const displayFields: (keyof ShipConfiguration)[] = ['name', 'frameSymbol', 'engineSymbol', 'reactorSymbol']

        displayFields.forEach(field => {
            const name = ship.shipConfiguration[field].includes('_') ? ship.shipConfiguration[field].split('_').slice(1).join('_') : ship.shipConfiguration[field]
            const firstText = new Text(name, {
                align: 'left',
                font: fontStyle
            })
            firstText.flex = 1
            firstRow.addChild(firstText)
        })
        const thirdText = new Text(ship.price ? ship.price.toString() : '???', {
            align: 'right',
            font: fontStyle
        })
        thirdText.flex = 1
        firstRow.addChild(thirdText)
        const buyButton = new Button('Buy', {}, async (event) => {
            event.stopPropagation()
            await trpc.instructBuyShip.mutate({
                waypointSymbol: ship.waypointSymbol,
                shipConfigurationSymbol: ship.shipConfigurationSymbol
            })
            await updateCredits()
            loadSystem(Registry.currentSystem, false)
        })
        buyButton.disabled = this.readonly
        buyButton.flex = 1
        firstRow.addChild(buyButton)

        const counts = {}
        ship.shipConfiguration.shipConfigurationModule.forEach(module => {
            if (!counts[module.moduleSymbol]) {
                counts[module.moduleSymbol] = 1
            } else {
                counts[module.moduleSymbol]++
            }
        })
        const secondRowText = new Text(Object.keys(counts).map(moduleKey => `${moduleKey.replace('MODULE_', '')} x${counts[moduleKey]}`).join(', '), {
            align: 'left',
            font: fontStyle
        })
        secondRowText.flex = 1
        secondRow.addChild(secondRowText)

        flexRow.addChild(firstRow)
        flexRow.addChild(secondRow)

        this.container.addChild(flexRow)
    }
}
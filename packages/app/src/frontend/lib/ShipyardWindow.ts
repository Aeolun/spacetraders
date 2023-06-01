import type {ShipConfiguration, ShipyardModel} from '@app/prisma'
import {BitmapText, Container, NineSlicePlane} from "pixi.js";
import {Flex, FlexDirection} from "@front/lib/Flex";
import {loadedAssets} from "@front/lib/assets";
import {CenteredBitmapText} from "@front/lib/CenteredBitmapText";
import {trpc} from "@front/lib/trpc";
import {loadSystem} from "@front/lib/loadSystem";
import {GameState} from "@front/lib/game-state";


type ExpectedData = (ShipyardModel & { shipConfiguration: ShipConfiguration})
export class ShipyardWindow {
    public container: Container
    private flexContainer: Flex<Container>
    constructor(ships: ExpectedData[]) {
        this.container = new Container()
        this.container.x = (window.innerWidth - 600) / 2
        this.container.y = (window.innerHeight - 600) / 2

        this.flexContainer = new Flex(new NineSlicePlane(loadedAssets.statsBlock))
        this.flexContainer.height = 600
        this.flexContainer.width = 600
        this.flexContainer.flexDirection = FlexDirection.COLUMN

        ships.forEach(ship => {
            this.addGood(ship)
        })

        this.flexContainer.updateLayout()
        this.container.addChild(this.flexContainer.displayObject)
    }

    addGood(ship: ExpectedData) {
        const flexRow = new Flex(new NineSlicePlane(loadedAssets.statsBlock))

        flexRow.displayObject.interactive = true
        flexRow.displayObject.on('click', async (event) => {
            event.stopPropagation()
            await trpc.instructBuyShip.mutate({
                waypointSymbol: ship.waypointSymbol,
                shipConfigurationSymbol: ship.shipConfigurationSymbol
            })
            loadSystem(GameState.currentSystem, false)
        })

        flexRow.flexDirection = FlexDirection.ROW
        flexRow.height = 40
        flexRow.width = '100%'

        const fontStyle = {
            fontName: 'buttontext_white',
            fontSize: 12
        }

        const firstText = new Flex(new CenteredBitmapText(ship.shipConfiguration.name, fontStyle))
        firstText.flex = 1
        flexRow.addChild(firstText)
        const secondText = new Flex(new CenteredBitmapText(ship.shipConfiguration.frameSymbol, fontStyle))
        secondText.flex = 1
        flexRow.addChild(secondText)
        const thirdText = new Flex(new CenteredBitmapText(ship.price.toString(), fontStyle))
        thirdText.flex = 1
        flexRow.addChild(thirdText)

        this.flexContainer.addChild(flexRow)
    }
}
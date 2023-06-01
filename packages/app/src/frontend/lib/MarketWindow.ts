import {Container, NineSlicePlane} from "pixi.js";
import {Flex, FlexDirection} from "@front/lib/Flex";
import {loadedAssets} from "@front/lib/assets";
import {CenteredBitmapText} from "@front/lib/CenteredBitmapText";
import {MarketPrice} from "@app/prisma";

type ExpectedData = MarketPrice
type MarketGoodKind = 'IMPORT' | 'EXPORT' | 'EXCHANGE'
export class MarketWindow {
    public container: Container
    private flexContainer: Flex<Container>
    private flexColumns: Record<MarketGoodKind, Flex<Container>>
    private nextColumn = 0
    constructor() {
        this.container = new Container()
        this.container.x = 400
        this.container.y = window.innerHeight - 200

        this.flexContainer = new Flex(new NineSlicePlane(loadedAssets.statsBlock))
        this.flexContainer.height = 200
        this.flexContainer.width = window.innerWidth - 400
        this.flexContainer.flexDirection = FlexDirection.COLUMN

        const names: MarketGoodKind[] = ['IMPORT', 'EXPORT', 'EXCHANGE']

        const columnHeaders = new Flex(new NineSlicePlane(loadedAssets.statsBlock))
        columnHeaders.width = '100%'
        columnHeaders.height = 30
        columnHeaders.flexDirection = FlexDirection.ROW

        names.forEach(name => {
            const columnHead = new Flex(new CenteredBitmapText(name, {
                fontName: 'buttontext_white',
                fontSize: 12
            }))
            columnHead.flex = 1
            columnHeaders.addChild(columnHead)
        })
        this.flexContainer.addChild(columnHeaders)


        const dataColumns = new Flex(new NineSlicePlane(loadedAssets.statsBlock))
        dataColumns.flex = 1
        dataColumns.flexDirection = FlexDirection.ROW
        this.flexColumns = {
            IMPORT: new Flex(new NineSlicePlane(loadedAssets.statsBlock)),
            EXPORT: new Flex(new NineSlicePlane(loadedAssets.statsBlock)),
            EXCHANGE: new Flex(new NineSlicePlane(loadedAssets.statsBlock))
        }

        names.forEach(name => {
            this.flexColumns[name].flex = 1
            this.flexColumns[name].flexDirection = FlexDirection.COLUMN
            dataColumns.addChild(this.flexColumns[name])
        })
        this.flexContainer.addChild(dataColumns)

        this.container.addChild(this.flexContainer.displayObject)
    }

    setGoods(goods: ExpectedData[]) {
        goods.forEach(ship => {
            this.addGood(ship)
        })

        this.flexContainer.updateLayout()
    }

    clearGoods() {
        this.nextColumn = 0

        this.flexColumns.IMPORT.removeChildren()
        this.flexColumns.EXPORT.removeChildren()
        this.flexColumns.EXCHANGE.removeChildren()
    }

    addGood(good: ExpectedData) {
        const flexRow = new Flex(new NineSlicePlane(loadedAssets.statsBlock))

        flexRow.displayObject.tint = good.kind === 'EXPORT' ? 0x00FF00 : good.kind === 'IMPORT' ? 0xFF0000 : 0xFFFFFF
        flexRow.flexDirection = FlexDirection.ROW
        flexRow.height = 30
        flexRow.width = '100%'

        const fontStyle = {
            fontName: 'buttontext_white',
            fontSize: 12
        }

        const firstText = new Flex(new CenteredBitmapText(good.tradeGoodSymbol, fontStyle))
        firstText.flex = 1
        firstText.width = '25%'
        flexRow.addChild(firstText)
        const secondText = new Flex(new CenteredBitmapText(good.purchasePrice.toString(), fontStyle))
        secondText.width = '15%'
        flexRow.addChild(secondText)
        const thirdText = new Flex(new CenteredBitmapText(good.sellPrice.toString(), fontStyle))
        thirdText.width = '15%'
        flexRow.addChild(thirdText)
        const fourText = new Flex(new CenteredBitmapText(good.kind.toString(), fontStyle))
        fourText.width = '15%'
        flexRow.addChild(fourText)
        const fiveText = new Flex(new CenteredBitmapText(good.tradeVolume.toString(), fontStyle))
        fiveText.width = '15%'
        flexRow.addChild(fiveText)
        const sixText = new Flex(new CenteredBitmapText(good.supply.toString(), fontStyle))
        sixText.width = '15%'
        flexRow.addChild(sixText)

        const columns = ['IMPORT', 'EXPORT', 'EXCHANGE']
        this.flexColumns[columns[this.nextColumn]].addChild(flexRow)

        this.nextColumn++
        if (this.nextColumn >= columns.length) this.nextColumn = 0
    }
}

import {Flex, FlexDirection} from "@front/viewer/Flex";
import {loadedAssets} from "@front/viewer/assets";
import {MarketPrice} from "@backend/prisma";
import {Text} from "@front/viewer/ui-elements/text";
import {Container} from "@front/viewer/ui-elements/container";
import {gameWidth} from "@front/viewer/consts";

type ExpectedData = MarketPrice
type MarketGoodKind = 'IMPORT' | 'EXPORT' | 'EXCHANGE'
export class MarketWindow {
    public container: Container
    private flexColumns: Record<MarketGoodKind, Container>
    private nextColumn = 0
    constructor() {
        this.container = new Container()
        this.container.width = gameWidth - 400
        this.container.height = 300

        const names: MarketGoodKind[] = ['IMPORT', 'EXPORT', 'EXCHANGE']

        const columnHeaders = new Container()
        columnHeaders.width = '100%'
        columnHeaders.height = 30
        columnHeaders.flexDirection = FlexDirection.ROW

        names.forEach(name => {
            const columnHead = new Text(name, { align: 'center', font: {
                    fontName: 'buttontext_white',
                    fontSize: 12
                }})
            columnHead.flex = 1
            columnHeaders.addChild(columnHead)
        })
        this.container.addChild(columnHeaders)


        const dataColumns = new Container()
        dataColumns.flex = 1
        dataColumns.flexDirection = FlexDirection.ROW
        this.flexColumns = {
            IMPORT: new Container(),
            EXPORT: new Container(),
            EXCHANGE: new Container()
        }

        names.forEach(name => {
            this.flexColumns[name].flex = 1
            this.flexColumns[name].flexDirection = FlexDirection.COLUMN
            dataColumns.addChild(this.flexColumns[name])
        })
        this.container.addChild(dataColumns)
    }

    setGoods(goods: ExpectedData[]) {
        goods.forEach(ship => {
            this.addGood(ship)
        })

        this.container.updateLayout()
    }

    clearGoods() {
        this.nextColumn = 0

        this.flexColumns.IMPORT.removeChildren()
        this.flexColumns.EXPORT.removeChildren()
        this.flexColumns.EXCHANGE.removeChildren()
    }

    addGood(good: ExpectedData) {
        const flexRow = new Container()

        flexRow.displayObject.tint = good.kind === 'EXPORT' ? 0x00FF00 : good.kind === 'IMPORT' ? 0xFF0000 : 0xFFFFFF
        flexRow.flexDirection = FlexDirection.ROW
        flexRow.height = 30
        flexRow.width = '100%'

        const fontStyle = {
            fontName: 'buttontext_white',
            fontSize: 12
        }

        const firstText = new Text(good.tradeGoodSymbol, {align: 'left', font: fontStyle})
        firstText.flex = 1
        firstText.width = '25%'
        flexRow.addChild(firstText)

        const fourText = new Text(good.kind.toString(), {align: 'left', font: fontStyle})
        fourText.width = '15%'
        flexRow.addChild(fourText)

        const sixText = new Text(good.supply.toString(), {align: 'left', font: fontStyle})
        sixText.width = '15%'
        flexRow.addChild(sixText)
        const fiveText = new Text(good.tradeVolume.toString(), {align: 'left', font: fontStyle})
        fiveText.width = '15%'
        flexRow.addChild(fiveText)
        const secondText = new Text(good.purchasePrice.toString()+' P', {align: 'right', font: fontStyle})
        secondText.width = '15%'
        flexRow.addChild(secondText)
        const thirdText = new Text(good.sellPrice.toString()+' S', {align: 'right', font: fontStyle})
        thirdText.width = '15%'
        flexRow.addChild(thirdText)

        const columns = ['IMPORT', 'EXPORT', 'EXCHANGE']
        this.flexColumns[columns[this.nextColumn]].addChild(flexRow)

        this.nextColumn++
        if (this.nextColumn >= columns.length) this.nextColumn = 0
    }
}
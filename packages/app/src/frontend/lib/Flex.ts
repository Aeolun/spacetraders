import yoga, { Node, YogaNode, YogaJustifyContent } from '@aeolun/yoga-layout-prebuilt';
import {Container, DisplayObject} from "pixi.js";

export enum Justify {
    COUNT = 6,
    FLEX_START= 0,
    CENTER = 1,
    FLEX_END = 2,
    SPACE_BETWEEN = 3,
    SPACE_AROUND = 4,
    SPACE_EVENLY = 5
}

export enum Align {
    ALIGN_AUTO= 0,
    ALIGN_COUNT= 8,
    ALIGN_FLEX_START= 1,
    ALIGN_CENTER= 2,
    ALIGN_FLEX_END= 3,
    ALIGN_STRETCH= 4,
    ALIGN_BASELINE= 5,
    ALIGN_SPACE_BETWEEN= 6,
    ALIGN_SPACE_AROUND= 7,
}

export enum Side {
    COUNT = 9,
    LEFT = 0,
    TOP=  1,
    RIGHT= 2,
    BOTTOM= 3,
    START= 4,
    END= 5,
    HORIZONTAL= 6,
    VERTICAL= 7,
    ALL= 8,
}

export enum FlexDirection {
    COUNT= 4,
    COLUMN= 0,
    COLUMN_REVERSE= 1,
    ROW= 2,
    ROW_REVERSE= 3,
}

export enum FlexWrap {
    WRAP_NO_WRAP= 0,
    WRAP_WRAP= 1,
    WRAP_WRAP_REVERSE=2
}

export enum PositionType {
    RELATIVE = 0,
    ABSOLUTE = 1
}

export class Flex<T extends Container> {
    public node: YogaNode
    private children: Flex<Container>[] = []

    constructor(public displayObject: T) {
        this.node = Node.create()
    }

    updateLayout() {
        this.node.calculateLayout()
        this.updateDisplayObject()
    }

    private updateDisplayObject() {
        const computedLayout = this.node.getComputedLayout()
        console.log(computedLayout)

        this.displayObject.height = computedLayout.height
        this.displayObject.width = computedLayout.width
        this.displayObject.x = computedLayout.left
        this.displayObject.y = computedLayout.top

        this.children.forEach(child => {
            child.updateDisplayObject();
        })
    }

    removeChildren() {
        // remove from yoga
        const count = this.node.getChildCount()
        const removeList = []
        for(let i = 0; i < count; i ++) {
            removeList.push(this.node.getChild(i))
        }
        removeList.forEach(child => {
            this.node.removeChild(child)
        })

        // remove from pixi.js
        this.displayObject.removeChildren()

        // remove from flex object
        this.children = []
    }

    addChild<C extends Container>(child: Flex<C>) {
        this.node.insertChild(child.node, this.node.getChildCount())
        this.displayObject.addChild(child.displayObject)
        this.children.push(child)
    }

    set height(value: number | string) {
        if (typeof value === 'string') {
            this.node.setHeightPercent(parseInt(value.substring(0, value.length-1)))
        } else {
            this.node.setHeight(value)
        }
    }

    set position(value: PositionType) {
        this.node.setPositionType(value)
    }

    set minHeight(value: number | string) {
        if (typeof value === 'string') {
            this.node.setMinHeightPercent(parseInt(value.substring(0, value.length-1)))
        } else {
            this.node.setMinHeight(value)
        }
    }

    set maxHeight(value: number | string) {
        if (typeof value === 'string') {
            this.node.setMaxHeightPercent(parseInt(value.substring(0, value.length-1)))
        } else {
            this.node.setMaxHeight(value)
        }
    }

    set minWidth(value: number | string) {
        if (typeof value === 'string') {
            this.node.setMinWidthPercent(parseInt(value.substring(0, value.length-1)))
        } else {
            this.node.setMinWidth(value)
        }
    }

    set maxWidth(value: number | string) {
        if (typeof value === 'string') {
            this.node.setMaxWidthPercent(parseInt(value.substring(0, value.length-1)))
        } else {
            this.node.setMaxWidth(value)
        }
    }

    set flex(value: number) {
        this.node.setFlex(value)
    }

    set wrap(value: FlexWrap) {
        this.node.setFlexWrap(value)
    }

    set gap(value: number) {

    }

    set padding(value: number | string) {
        this.node.setPadding(Side.ALL, value)
    }
    set margin(value: number) {
        this.node.setMargin(Side.ALL, value)
    }

    set paddingHorizontal(value: number | string) {
        this.node.setPadding(Side.HORIZONTAL, value)
    }

    set paddingVertical(value: number | string) {
        this.node.setPadding(Side.VERTICAL, value)
    }

    set width(value: number | string) {
        if (typeof value === 'string') {
            this.node.setWidthPercent(parseInt(value.substring(0, value.length-1)))
        } else {
            this.node.setWidth(value)
        }
    }

    set justifyContent(value: Justify) {
        this.node.setJustifyContent(value as yoga.YogaJustifyContent)
    }

    set alignItems(value: Align) {
        this.node.setAlignItems(value as yoga.YogaAlign)
    }

    set alignContent(value: Align) {
        this.node.setAlignContent(value as yoga.YogaAlign)
    }

    set flexDirection(value: FlexDirection) {
        this.node.setFlexDirection(value as yoga.YogaFlexDirection)
    }
}

import {IPointData} from "@pixi/core";
import {systemCoordinates, totalSize, universeCoordinates, systemScale} from "@front/lib/consts";

export const worldCoordinateToOriginal = (point: IPointData) => {
    const multiFactor = (universeCoordinates.maxX - universeCoordinates.minX) / totalSize
    return {
        x: Math.round(universeCoordinates.minX + (point.x * multiFactor)),
        y: Math.round(universeCoordinates.minY + (point.y * multiFactor))
    }
}

export const systemCoordinateToOriginal = (point: IPointData) => {
    return {
        x: Math.round(systemCoordinates.minX + (point.x / systemScale)),
        y: Math.round(systemCoordinates.minY + (point.y / systemScale))
    }
}
import {PointData} from "pixi.js";
import {mapScale, systemDistanceMultiplier} from "@front/viewer/consts";

export const worldCoordinateToOriginal = (point: PointData) => {
    return {
        x: point.x,
        y: point.y
    }
}

export const systemToDisplayCoordinates = (point: PointData) => {
    return {
        x: point.x * systemDistanceMultiplier * mapScale,
        y: point.y * systemDistanceMultiplier * mapScale
    }
}
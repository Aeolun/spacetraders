import {PointData} from "pixi.js";

export const worldCoordinateToOriginal = (point: PointData) => {
    return {
        x: point.x,
        y: point.y
    }
}

import {getDistance} from "@common/lib/getDistance";

export const getFuelCost = (pos1: {x: number, y: number}, pos2: {x: number, y: number}) => {
    return Math.ceil(getDistance(pos1, pos2) / 100) * 220
}
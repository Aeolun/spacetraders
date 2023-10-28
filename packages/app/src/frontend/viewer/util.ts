import {mapScale} from "@front/viewer/consts";

export const convertToDisplayCoordinates = (position: { x: number, y: number}) => {
  return {
    x: position.x * mapScale,
    y: position.y * mapScale,
  }
}
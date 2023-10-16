import {totalSize, universeCoordinates} from "@front/game/consts";

export const convertToDisplayCoordinates = (position: { x: number, y: number}) => {
  return {
    x: (position.x+Math.abs(universeCoordinates.minX))/(universeCoordinates.maxX-universeCoordinates.minX)*totalSize,
    y: (position.y+Math.abs(universeCoordinates.minY))/(universeCoordinates.maxY-universeCoordinates.minY)*totalSize,
  }
}
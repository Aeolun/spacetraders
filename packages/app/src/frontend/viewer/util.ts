import {mapScale, systemDistanceMultiplier} from "@front/viewer/consts";

export const getStarPosition = (position: { x: number, y: number}) => {
  return {
    x: position.x * mapScale * systemDistanceMultiplier,
    y: position.y * mapScale * systemDistanceMultiplier,
  }
}

export const getSystemPosition = (position: { x: number, y: number}, starPosition: { x: number, y: number }) => {
  const star = getStarPosition(starPosition)
  return {
    x: star.x + (position.x * mapScale),
    y: star.y + (position.y * mapScale),
  }
}
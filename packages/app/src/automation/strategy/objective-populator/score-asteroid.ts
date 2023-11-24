import {Waypoint} from "@common/prisma";
import {getDistance} from "@common/lib/getDistance";

export type ScoreProperties = Pick<Waypoint, 'x' | 'y'> & { traits: { symbol: string }[] }
export const scoreAsteroid = (asteroid: ScoreProperties, asteroidBases: ScoreProperties[]) => {
  let score = 0;
  if (asteroid.traits.some(t => t.symbol === 'PRECIOUS_METAL_DEPOSITS')) {
    score += 2
  }
  if (asteroid.traits.some(t => t.symbol === 'RARE_METAL_DEPOSITS')) {
    score += 3
  }
  if (asteroid.traits.some(t => t.symbol === 'COMMON_METAL_DEPOSITS')) {
    score += 1
  }
  const distanceFromClosestAsteroidScorePenalty = asteroidBases.length > 0 ? asteroidBases.reduce((acc, asteroidBase) => {
    const distanceScore = getDistance(asteroidBase, asteroid)/100
    if (distanceScore < acc) {
      return distanceScore
    }
    return acc
  }, 10) : 0
  score -= distanceFromClosestAsteroidScorePenalty
  return score
}
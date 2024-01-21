import {Waypoint} from "@common/prisma";
import {getDistance} from "@common/lib/getDistance";

export type ScoreProperties = Pick<Waypoint, 'x' | 'y'> & { traits: { symbol: string }[] }
export type BaseScoreProperties = ScoreProperties & { tradeGoods: { tradeGoodSymbol: string }[] }

const expectedResourceCount = 4;
export const scoreAsteroid = (asteroid: ScoreProperties, asteroidBases: BaseScoreProperties[]) => {
  let score = 0;
  if (asteroid.traits.some(t => t.symbol === 'PRECIOUS_METAL_DEPOSITS')) {
    score += 3
  }
  if (asteroid.traits.some(t => t.symbol === 'RARE_METAL_DEPOSITS')) {
    score += 3
  }
  if (asteroid.traits.some(t => t.symbol === 'COMMON_METAL_DEPOSITS')) {
    score += 2
  }
  const distanceFromClosestAsteroidScorePenalty = asteroidBases.length > 0 ? asteroidBases.reduce((highestDistancePenalty, asteroidBase) => {
    const distancePenalty = (getDistance(asteroidBase, asteroid) / 100) * (expectedResourceCount / asteroidBase.tradeGoods.length)
    if (distancePenalty < highestDistancePenalty) {
      return distancePenalty
    }
    return highestDistancePenalty
  }, 10) : 0
  score -= distanceFromClosestAsteroidScorePenalty
  return score
}
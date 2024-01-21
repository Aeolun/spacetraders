import {test, describe, it, expect} from "vitest";
import {BaseScoreProperties, scoreAsteroid, ScoreProperties} from "@auto/strategy/objective-populator/score-asteroid";

// Helper function to sort asteroids by score
const sortAsteroids = (asteroids: ScoreProperties[], asteroidBases: ScoreProperties[]) => {
  return asteroids.sort((a, b) => scoreAsteroid(b, asteroidBases) - scoreAsteroid(a, asteroidBases));
};

const testSortAsteroids = ({ asteroids, asteroidBases, expected }: any) => {
  const actual = sortAsteroids(asteroids, asteroidBases);

  expected.forEach((asteroid: any) => {
    if (asteroid.score) {
      expect(scoreAsteroid(asteroid, asteroidBases)).toBeCloseTo(asteroid.score)
    }
  })

  expect(actual).toEqual(expected.map((a: any) => {
    return {
      x: a.x,
      y: a.y,
      traits: a.traits,
    }
  }));
};

const defaultTradeGoods = [{ tradeGoodSymbol: 'IRON_ORE' }, { tradeGoodSymbol: 'IRON_ORE' }, { tradeGoodSymbol: 'IRON_ORE' }, { tradeGoodSymbol: 'IRON_ORE' }]

const testCases = [
  {
    name: 'Test Case - No Traits',
    asteroids: [
      { x: 1, y: 2, traits: [] },
      { x: 3, y: 4, traits: [] },
      { x: 5, y: 6, traits: [] },
    ],
    asteroidBases: [
      { x: 7, y: 8, traits: [], tradeGoods: defaultTradeGoods },
    ],
    expected: [
      { x: 5, y: 6, traits: [] },
      { x: 3, y: 4, traits: [] },
      { x: 1, y: 2, traits: [] },
    ],
  },
  {
    name: 'Test Case - Mixed Traits',
    asteroids: [
      { x: 1, y: 2, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
      { x: 3, y: 4, traits: [{ symbol: 'PRECIOUS_METAL_DEPOSITS' }, { symbol: 'RARE_METAL_DEPOSITS' }] },
      { x: 5, y: 6, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }] },
    ],
    asteroidBases: [
      { x: 7, y: 8, traits: [], tradeGoods: defaultTradeGoods },
    ],
    expected: [
      { x: 3, y: 4, traits: [{ symbol: 'PRECIOUS_METAL_DEPOSITS' }, { symbol: 'RARE_METAL_DEPOSITS' }] },
      { x: 5, y: 6, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }] },
      { x: 1, y: 2, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
    ],
  },
  {
    name: 'Test Case - Same Score Different Distance',
    asteroids: [
      { x: 1, y: 2, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }] },
      { x: 3, y: 4, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }] },
    ],
    asteroidBases: [
      { x: 2, y: 3, traits: [], tradeGoods: defaultTradeGoods },
    ],
    expected: [
      { x: 1, y: 2, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }] },
      { x: 3, y: 4, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }] },
    ],
  },
  {
    name: 'Test Case - No Asteroid Bases',
    asteroids: [
      { x: 1, y: 2, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
      { x: 3, y: 4, traits: [{ symbol: 'PRECIOUS_METAL_DEPOSITS' }] },
    ],
    asteroidBases: [],
    expected: [
      { x: 3, y: 4, traits: [{ symbol: 'PRECIOUS_METAL_DEPOSITS' }] },
      { x: 1, y: 2, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
    ],
  },
  {
    name: 'Test Case - All Same Traits',
    asteroids: [
      { x: 1, y: 2, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
      { x: 3, y: 4, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
      { x: 5, y: 6, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
    ],
    asteroidBases: [
      { x: 7, y: 8, traits: [], tradeGoods: defaultTradeGoods },
    ],
    expected: [
      { x: 5, y: 6, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
      { x: 3, y: 4, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
      { x: 1, y: 2, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
    ],
  },
  {
    name: 'Test Case - Distance weighs higher than materials',
    asteroids: [
      { x: 300, y: 300, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }] },
      { x: 3, y: 4, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
      { x: 5, y: 6, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }] },
    ],
    asteroidBases: [
      { x: 7, y: 8, traits: [], tradeGoods: defaultTradeGoods },
    ],
    expected: [
      { x: 5, y: 6, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }], score: 1.97 },
      { x: 3, y: 4, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }], score: 1.94 },
      { x: 300, y: 300, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }], score: -1.1365 },
    ],
  }
];
describe('scoreAsteroid', () => {
  it('should score 0 for an asteroid with no traits', () => {
    const asteroid: ScoreProperties = {
      traits: [],
      x: 0,
      y: 0,
    };
    const asteroidBases: BaseScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(0);
  });

  it('should score correctly for an asteroid with PRECIOUS_METAL_DEPOSITS trait', () => {
    const asteroid: ScoreProperties = {
      traits: [{ symbol: 'PRECIOUS_METAL_DEPOSITS' }],
      x: 0,
      y: 0,
    };
    const asteroidBases: BaseScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(3);
  });

  it('should score correctly for an asteroid with RARE_METAL_DEPOSITS trait', () => {
    const asteroid: ScoreProperties = {
      traits: [{ symbol: 'RARE_METAL_DEPOSITS' }],
      x: 0,
      y: 0,
    };
    const asteroidBases: BaseScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(3);
  });

  it('should score correctly for an asteroid with COMMON_METAL_DEPOSITS trait', () => {
    const asteroid: ScoreProperties = {
      traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }],
      x: 0,
      y: 0,
    };
    const asteroidBases: BaseScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(2);
  });

  it('should accumulate scores for an asteroid with multiple traits', () => {
    const asteroid: ScoreProperties = {
      traits: [
        { symbol: 'PRECIOUS_METAL_DEPOSITS' },
        { symbol: 'RARE_METAL_DEPOSITS' },
        { symbol: 'COMMON_METAL_DEPOSITS' },
      ],
      x: 0,
      y: 0,
    };
    const asteroidBases: BaseScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(8);
  });

  it('asteroid is penalized based on closest asteroid base', () => {
    const asteroid: ScoreProperties = {
      traits: [],
      x: 0,
      y: 0,
    };
    const asteroidBases: BaseScoreProperties[] = [
      { traits: [], x: 10, y: 10, tradeGoods: defaultTradeGoods },
      { traits: [], x: 200, y: 200, tradeGoods: defaultTradeGoods },
    ];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBeCloseTo(-0.141, 1);
  });

  it('very far asteroid gets high penalty to score', () => {
    const asteroid: ScoreProperties = {
      traits: [],
      x: 200,
      y: 200,
    };
    const asteroidBases: BaseScoreProperties[] = [
      { traits: [], x: 0, y: 0, tradeGoods: defaultTradeGoods },
    ];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBeCloseTo(-2.828, 1);
  });

  it('asteroid is penalized double if asteroid base has half the sellable goods', () => {
    const asteroid: ScoreProperties = {
      traits: [],
      x: 200,
      y: 200,
    };
    const asteroidBases: BaseScoreProperties[] = [
      { traits: [], x: 0, y: 0, tradeGoods: [{ tradeGoodSymbol: 'IRON_ORE' }, { tradeGoodSymbol: 'IRON_ORE' }] },
    ];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBeCloseTo(-5.656, 1);
  });
});

describe('sortAsteroids', () => {
  testCases.forEach((testCase) => {
    test(testCase.name, () => {
      testSortAsteroids(testCase);
    });
  });
});



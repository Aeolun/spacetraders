import {test, describe, it, expect} from "vitest";
import {scoreAsteroid, ScoreProperties} from "@auto/strategy/objective-populator/score-asteroid";

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

const testCases = [
  {
    name: 'Test Case - No Traits',
    asteroids: [
      { x: 1, y: 2, traits: [] },
      { x: 3, y: 4, traits: [] },
      { x: 5, y: 6, traits: [] },
    ],
    asteroidBases: [
      { x: 7, y: 8, traits: [] },
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
      { x: 7, y: 8, traits: [] },
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
      { x: 2, y: 3, traits: [] },
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
      { x: 7, y: 8, traits: [] },
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
      { x: 7, y: 8, traits: [] },
    ],
    expected: [
      { x: 5, y: 6, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }], score: 0.97 },
      { x: 3, y: 4, traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }], score: 0.94 },
      { x: 300, y: 300, traits: [{ symbol: 'RARE_METAL_DEPOSITS' }], score: -1.136 },
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
    const asteroidBases: ScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(0);
  });

  it('should score correctly for an asteroid with PRECIOUS_METAL_DEPOSITS trait', () => {
    const asteroid: ScoreProperties = {
      traits: [{ symbol: 'PRECIOUS_METAL_DEPOSITS' }],
      x: 0,
      y: 0,
    };
    const asteroidBases: ScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(2);
  });

  it('should score correctly for an asteroid with RARE_METAL_DEPOSITS trait', () => {
    const asteroid: ScoreProperties = {
      traits: [{ symbol: 'RARE_METAL_DEPOSITS' }],
      x: 0,
      y: 0,
    };
    const asteroidBases: ScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(3);
  });

  it('should score correctly for an asteroid with COMMON_METAL_DEPOSITS trait', () => {
    const asteroid: ScoreProperties = {
      traits: [{ symbol: 'COMMON_METAL_DEPOSITS' }],
      x: 0,
      y: 0,
    };
    const asteroidBases: ScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(1);
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
    const asteroidBases: ScoreProperties[] = [];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBe(6);
  });

  it('should include distance from asteroid bases in the score', () => {
    const asteroid: ScoreProperties = {
      traits: [],
      x: 0,
      y: 0,
    };
    const asteroidBases: ScoreProperties[] = [
      { traits: [], x: 10, y: 10 },
      { traits: [], x: 20, y: 20 },
    ];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBeCloseTo(0.282, 1);
  });

  it('very far asteroid has high score the score', () => {
    const asteroid: ScoreProperties = {
      traits: [],
      x: 200,
      y: 200,
    };
    const asteroidBases: ScoreProperties[] = [
      { traits: [], x: 0, y: 0 },
    ];
    expect(scoreAsteroid(asteroid, asteroidBases)).toBeCloseTo(5.65, 1);
  });
});

describe('sortAsteroids', () => {
  testCases.forEach((testCase) => {
    test(testCase.name, () => {
      testSortAsteroids(testCase);
    });
  });
});



import { describe, it, expect, vi } from 'vitest';
import {findPlaceToSellGood, InputSaleLocation} from './find-place-to-sell-good';
import { Ship } from "@auto/ship/ship";
import {TradeSymbol} from "spacetraders-sdk";

// Mock getDistance function
vi.mock('@common/lib/getDistance', () => ({
  getDistance: vi.fn((a, b) => Math.hypot(b.x - a.x, b.y - a.y)),
}));

describe('findPlaceToSellGood', () => {
  it('should sort sale locations by distance and price', async () => {
    const saleLocationsInSameSystem = [
      { tradeGoodSymbol: 'FUEL', sellPrice: 10, waypoint: { symbol: 'WP1', systemSymbol: 'SYS1', x: 0, y: 0 } },
      { tradeGoodSymbol: 'SILVER', sellPrice: 20, waypoint: { symbol: 'WP2', systemSymbol: 'SYS1', x: 5, y: 5 } },
      // Add more test cases as needed
    ];
    const currentWaypoint = { symbol: 'WP0', systemSymbol: 'SYS1', x: 10, y: 10 };
    const tradeSymbols: Partial<Record<TradeSymbol, number>> = {
      FUEL: 5,
      SILVER: 3,
      // Add more test cases as needed
    };

    const result = await findPlaceToSellGood(saleLocationsInSameSystem, currentWaypoint, tradeSymbols);

    // Assertions to check if sorting is correct
    expect(result[0].waypoint.symbol).toBe('WP2');
    expect(result[1].waypoint.symbol).toBe('WP1');
    // Add more assertions as needed
  });

  it('should group sale locations by waypoint', async () => {
    // Similar setup to the previous test case, but with different data to test grouping
    const saleLocationsInSameSystem = [
      { tradeGoodSymbol: 'FUEL', sellPrice: 10, waypoint: { symbol: 'WP1', systemSymbol: 'SYS1', x: 0, y: 0 } },
      { tradeGoodSymbol: 'SILVER', sellPrice: 20, waypoint: { symbol: 'WP1', systemSymbol: 'SYS1', x: 0, y: 0 } },
      // Add more test cases as needed
    ];
    const currentWaypoint = { symbol: 'WP0', systemSymbol: 'SYS1', x: 10, y: 10 };
    const tradeSymbols:  Partial<Record<TradeSymbol, number>> = {
      FUEL: 5,
      SILVER: 3,
      // Add more test cases as needed
    };

    const result = await findPlaceToSellGood(saleLocationsInSameSystem, currentWaypoint, tradeSymbols);

    // Assertions to check if grouping by waypoint is correct
    expect(result.length).toBe(1); // All goods should be grouped under one waypoint
    expect(result[0].waypoint.symbol).toBe('WP1');
    expect(result[0].goods.length).toBe(2); // Two goods should be grouped together
  });

  it('should sort waypoints by the number of goods', async () => {
    // Similar setup to the previous test case, but with different data to test sorting by goods count
    const saleLocationsInSameSystem = [
      { tradeGoodSymbol: 'FUEL', sellPrice: 10, waypoint: { symbol: 'WP1', systemSymbol: 'SYS1', x: 0, y: 0 } },
      { tradeGoodSymbol: 'SILVER', sellPrice: 20, waypoint: { symbol: 'WP2', systemSymbol: 'SYS1', x: 5, y: 5 } },
      { tradeGoodSymbol: 'GOLD', sellPrice: 15, waypoint: { symbol: 'WP2', systemSymbol: 'SYS1', x: 5, y: 5 } },
      // Add more test cases as needed
    ];
    const currentWaypoint = { symbol: 'WP0', systemSymbol: 'SYS1', x: 10, y: 10 };
    const tradeSymbols: Partial<Record<TradeSymbol, number>> = {
      FUEL: 5,
      SILVER: 3,
      GOLD: 2,
      // Add more test cases as needed
    };

    const result = await findPlaceToSellGood(saleLocationsInSameSystem, currentWaypoint, tradeSymbols);

    // Assertions to check if sorting by goods count is correct
    expect(result[0].waypoint.symbol).toBe('WP2'); // WP2 has more goods than WP1
    expect(result[0].goods.length).toBeGreaterThan(result[1].goods.length);
  });

  it('should prefer closer sale location to the first when they have the same amount of tradegoods', async () => {
    const saleLocationsInSameSystem = [
      { tradeGoodSymbol: 'FUEL', sellPrice: 10, waypoint: { symbol: 'WP1', systemSymbol: 'SYS1', x: 0, y: 0 } },
      { tradeGoodSymbol: 'SILVER', sellPrice: 20, waypoint: { symbol: 'WP2', systemSymbol: 'SYS1', x: 5, y: 5 } },
      { tradeGoodSymbol: 'GOLD', sellPrice: 15, waypoint: { symbol: 'WP3', systemSymbol: 'SYS1', x: 3, y: 4 } },
      { tradeGoodSymbol: 'DIAMONDS', sellPrice: 15, waypoint: { symbol: 'WP4', systemSymbol: 'SYS1', x: 2, y: 2 } }
    ];
    const currentWaypoint = { symbol: 'WP0', systemSymbol: 'SYS1', x: 10, y: 10 };
    const tradeSymbols: Partial<Record<TradeSymbol, number>> = {
      FUEL: 5,
      SILVER: 3,
      GOLD: 2,
      DIAMONDS: 2
    };

    const result = await findPlaceToSellGood(saleLocationsInSameSystem, currentWaypoint, tradeSymbols);

    // Assertions to check if the second sale location is closer to the first
    expect(result[0].waypoint.symbol).toBe('WP2');
    expect(result[1].waypoint.symbol).toBe('WP3'); // WP4 is closer to WP1 than WP3 is to WP1
  });

  it('only sell each good once, even if more locations to sell exist, and does not include stuff not in cargo', async () => {
    const saleLocationsInSameSystem = [
      { tradeGoodSymbol: 'FUEL', sellPrice: 10, waypoint: { symbol: 'WP1', systemSymbol: 'SYS1', x: 0, y: 0 } },
      { tradeGoodSymbol: 'SILVER', sellPrice: 13, waypoint: { symbol: 'WP1', systemSymbol: 'SYS1', x: 0, y: 0 } },
      { tradeGoodSymbol: 'FUEL', sellPrice: 20, waypoint: { symbol: 'WP2', systemSymbol: 'SYS1', x: 5, y: 5 } },
      { tradeGoodSymbol: 'GOLD', sellPrice: 15, waypoint: { symbol: 'WP2', systemSymbol: 'SYS1', x: 5, y: 5 } },
      { tradeGoodSymbol: 'GOLD_ORE', sellPrice: 16, waypoint: { symbol: 'WP3', systemSymbol: 'SYS1', x: 6, y: 6 } },
      { tradeGoodSymbol: 'SILVER_ORE', sellPrice: 6, waypoint: { symbol: 'WP3', systemSymbol: 'SYS1', x: 6, y: 6 } },
    ];
    const currentWaypoint = { symbol: 'WP0', systemSymbol: 'SYS1', x: 10, y: 10 };
    const tradeSymbols: Partial<Record<TradeSymbol, number>> = {
      FUEL: 5,
      GOLD: 2,
      SILVER: 2,
      GOLD_ORE: 1
    };

    const result = await findPlaceToSellGood(saleLocationsInSameSystem, currentWaypoint, tradeSymbols);

    // Assertions to check if the second sale location is closer to the first
    expect(result.length).toBe(3)
    expect(result).toMatchObject([{
      goods: [
        {
          symbol: "FUEL",
          quantity: 5,
        },
        {
          symbol: "GOLD",
          quantity: 2,
        }
      ]
    }, {
      goods: [
        {
          symbol: "GOLD_ORE",
          quantity: 1,
        }
      ]
    }, {
      goods: [
        {
          symbol: 'SILVER',
          quantity: 2
        }
      ]
    }])
  });

  it('should handle no sale locations', async () => {
    const saleLocationsInSameSystem: InputSaleLocation[] = [];
    const currentWaypoint = { symbol: 'WP0', systemSymbol: 'SYS1', x: 10, y: 10 };
    const tradeSymbols = {};

    const result = await findPlaceToSellGood(saleLocationsInSameSystem, currentWaypoint, tradeSymbols);

    expect(result).toEqual([]);
  });

  // Add more test cases to cover edge cases and other scenarios
});
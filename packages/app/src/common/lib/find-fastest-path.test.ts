import {findFastestPath} from "@common/lib/find-fastest-path";
import { test, expect } from "vitest";

test('fastest path simple', async () => {
  const res = await findFastestPath([
    {name: 'a', x: 0, y: 0},
    {name: 'b', x: 0, y: 1},
    {name: 'c', x: 0, y: 2},
  ], 'a')

  expect(res.path).toEqual(['a', 'c', 'b'])
  expect(res.timings.solveTime).toBeLessThan(500)
})

test('fastest path complex', async () => {
  const res = await findFastestPath([
    {name: 'a', x: 0, y: 0},
    {name: 'b', x: 325, y: 1},
    {name: 'c', x: 28, y: 271},
    {name: 'd', x: 2813, y: 271},
    {name: 'e', x: 39, y: 1271},
    {name: 'f', x: 933, y: 471},
  ], 'a')

  expect(res.path).toEqual(['a', 'c', 'e', 'f', 'd', 'b'])
  expect(res.timings.solveTime).toBeLessThan(500)
})
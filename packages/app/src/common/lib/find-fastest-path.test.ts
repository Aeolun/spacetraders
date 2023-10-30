import {findFastestPath} from "@common/lib/find-fastest-path";
import { test, afterAll, beforeAll, expect } from "vitest";
import * as child_process from "child_process";

let cp: child_process.ChildProcess
beforeAll(() => {
  cp = child_process.exec('poetry run python -m flask run')
})

afterAll(() => {
  cp.kill()
})

test('fastest path simple', async () => {
  const res = await findFastestPath([
    {name: 'a', x: 0, y: 0},
    {name: 'b', x: 0, y: 1},
    {name: 'c', x: 0, y: 2},
  ], 'a')

  expect(res.path).toEqual(['a', 'b', 'c'])
  expect(res.timings.solveTime).toBeLessThan(50)
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

  expect(res.path).toEqual(['a', 'f', 'e', 'd', 'c', 'b'])
  expect(res.timings.solveTime).toBeLessThan(500)
})
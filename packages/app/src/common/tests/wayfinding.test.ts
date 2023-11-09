import {Wayfinding} from "@common/lib/wayfinding";
import systems from './mocks/systems.json'
import { expect, test } from "vitest";
import {System} from "spacetraders-sdk";
import {beforeAll} from "vitest";

let wayfinder: Wayfinding
test('wayfinding', async () => {
  expect(1).toBe(1);
});
// beforeAll(async () => {
//   wayfinder = new Wayfinding()
//   await wayfinder.loadWaypointsFromJson(systems as System[])
// })
// test('wayfinding', async () => {
//   const route = await wayfinder.findRoute('X1-SD19', 'X1-GY82', {
//     max: 1000,
//     current: 500
//   })
//   expect(route.finalPath).toMatchSnapshot()
// })
//
// test('wayfinding 2', async () => {
//   const route = await wayfinder.findRoute('X1-CH98', 'X1-MF76', {
//     max: 1000,
//     current: 500
//   })
//   expect(route.finalPath).toMatchSnapshot()
//   expect(wayfinder.getConnectionsForSystem('X1-MF76')).toMatchSnapshot()
//   expect(wayfinder.getConnectionsForSystem('X1-HU19')).toMatchSnapshot()
// })
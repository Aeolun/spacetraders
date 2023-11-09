import {expect, test} from 'vitest'
import {Ship} from "@auto/ship/ship";
import createApi from "@common/lib/createApi";

test('ship determines if it has too much cargo', () => {
  const ship = new Ship('PHANTASM-1', createApi('bla'))

  ship.currentCargo = {
    FUEL: 1,
  }

  ship.expectedCargo = {}

  expect(ship.hasMoreThanExpectedCargo()).toBe(true)
})
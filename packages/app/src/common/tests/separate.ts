import {Wayfinding} from "@common/lib/wayfinding";
import systems from "@common/tests/mocks/systems.json";
import {System} from "spacetraders-sdk";

const execute = async () => {
  const wayfinder = new Wayfinding()
  await wayfinder.loadWaypointsFromJson(systems as System[])
  for(let i = 0; i < 20; i++) {
    const route = await wayfinder.findRoute('X1-CH98', 'X1-MF76', {
      max: 1000,
      current: 500
    })
  }
}
execute();
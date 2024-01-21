import {LocationWithWaypointSpecifier} from "@auto/strategy/types";
import {Ship} from "@auto/ship/ship";
import {waypointLocationFromSymbol} from "@auto/ship/behaviors/atoms/waypoint-location-from-symbol";
import {craftTravelTasks} from "@auto/ship/behaviors/atoms/craft-travel-tasks";

export const appendTravelTasks = async (ship: Ship, destination: LocationWithWaypointSpecifier) => {
  const currentLocation = await waypointLocationFromSymbol(ship.currentWaypointSymbol)
  const travelTasks = await craftTravelTasks(currentLocation, destination, {
    speed: ship.engineSpeed,
    maxFuel: ship.maxFuel,
    currentFuel: ship.fuel,
  })
  for(const task of travelTasks) {
    await ship.addTask(task)
  }
}
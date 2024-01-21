import {ShipNavFlightMode} from "spacetraders-sdk";

export const travelCooldown = (distance: number, mode: ShipNavFlightMode, engineSpeed: number) => {
  let multiplier = 1
  const baseSpeed = 25;
  switch (mode) {
    case ShipNavFlightMode.Burn:
      multiplier = 0.5
      break;
    case ShipNavFlightMode.Cruise:
      multiplier = 1
      break;
    case ShipNavFlightMode.Drift:
      multiplier = 10
      break;
  }

  return Math.round(Math.round(Math.max(1, distance)) * ((baseSpeed*multiplier) / engineSpeed)) + 15
}
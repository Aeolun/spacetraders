import {Waypoint} from "prisma";
import {Ship} from "@app/ship/ship";

export const mineAt = async (ship: Ship, waypoint: Waypoint) => {
  const extractResult = await ship.extract();
}
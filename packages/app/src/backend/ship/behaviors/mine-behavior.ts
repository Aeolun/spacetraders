import {Ship} from "@app/ship/ship";
import {findMineableWaypoint} from "@app/ship/behaviors/atoms/find-mineable-waypoint";
import {travelTo} from "@app/ship/behaviors/atoms/travel-to";
import {mineAt} from "@app/ship/behaviors/atoms/mine-at";

export const mineBehavior = async (ship: Ship) => {
    const mineLocation = await findMineableWaypoint(ship)
    await travelTo(ship, mineLocation);
    await mineAt(ship, mineLocation);
    const sellLocation = await findPlaceToSellGood(ship)
}
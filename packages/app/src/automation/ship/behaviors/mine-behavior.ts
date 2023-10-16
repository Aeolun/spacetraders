import {Ship} from "@auto/ship/ship";
import {findMineableWaypoint} from "@auto/ship/behaviors/atoms/find-mineable-waypoint";
import {travelTo} from "@auto/ship/behaviors/atoms/travel-to";
import {mineAt} from "@auto/ship/behaviors/atoms/mine-at";

export const mineBehavior = async (ship: Ship) => {
    const mineLocation = await findMineableWaypoint(ship)
    await travelTo(ship, mineLocation);
    await mineAt(ship, mineLocation);
    //const sellLocation = await findPlaceToSellGood(ship)
}
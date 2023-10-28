import {Wayfinding} from "@common/lib/wayfinding";

export const defaultWayfinder = new Wayfinding()
defaultWayfinder.loadWaypointsFromDb();
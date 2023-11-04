import {Wayfinding} from "@common/lib/wayfinding";
import {SystemWayfinding} from "@common/lib/system-wayfinding";

export const defaultWayfinder = new Wayfinding()
defaultWayfinder.loadWaypointsFromDb();

export const defaultSystemWayfinder = new SystemWayfinding()
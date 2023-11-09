import {TravelTask} from "@auto/ship/task/travel";
import {ExploreTask} from "@auto/ship/task/explore";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {SellTask} from "@auto/ship/task/sell";
import {UpdateMarketTask} from "@auto/ship/task/update-market";
import {PurchaseShipTask} from "@auto/ship/task/purchase-ship";

export type Task = ExploreTask | TravelTask | PurchaseTask | SellTask | UpdateMarketTask | PurchaseShipTask
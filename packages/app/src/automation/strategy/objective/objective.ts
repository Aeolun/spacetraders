import {ExploreObjective} from "@auto/strategy/objective/explore-objective";
import {UpdateMarketDataObjective} from "@auto/strategy/objective/update-market-data-objective";
import {TradeObjective} from "@auto/strategy/objective/trade-objective";
import {TravelObjective} from "@auto/strategy/objective/travel-objective";
import {PurchaseShipObjective} from "@auto/strategy/objective/purchase-ship";
import {EmptyCargoObjective} from "@auto/strategy/objective/empty-cargo-objective";

export type Objective = ExploreObjective | TradeObjective | UpdateMarketDataObjective | TravelObjective | PurchaseShipObjective | EmptyCargoObjective | MineObjective
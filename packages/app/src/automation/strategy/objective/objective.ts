import {ExploreObjective} from "@auto/strategy/objective/explore-objective";
import {UpdateMarketDataObjective} from "@auto/strategy/objective/update-market-data-objective";
import {TradeObjective} from "@auto/strategy/objective/trade-objective";
import {PurchaseShipObjective} from "@auto/strategy/objective/purchase-ship";
import {EmptyCargoObjective} from "@auto/strategy/objective/empty-cargo-objective";
import { MineObjective } from "./mine-objective";
import {SiphonObjective} from "@auto/strategy/objective/siphon-objective";
import {SurveyObjective} from "@auto/strategy/objective/survey-objective";
import {PickupCargoObjective} from "@auto/strategy/objective/pickup-cargo-objective";
import {ConstructObjective} from "@auto/strategy/objective/construct-objective";

export type Objective = ExploreObjective | TradeObjective | UpdateMarketDataObjective | PurchaseShipObjective | EmptyCargoObjective | MineObjective | SiphonObjective | SurveyObjective | PickupCargoObjective | ConstructObjective
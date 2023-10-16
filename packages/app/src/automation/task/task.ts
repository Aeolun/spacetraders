import {ExploreTask} from "@auto/task/explore-task";
import {UpdateMarketData} from "@auto/task/update-market-data";
import {TradeTask} from "@auto/task/trade-task";

export type Task = ExploreTask | TradeTask | UpdateMarketData
import {TravelTask} from "@auto/ship/task/travel";
import {ExploreTask} from "@auto/ship/task/explore";
import {PurchaseTask} from "@auto/ship/task/purchase";
import {SellTask} from "@auto/ship/task/sell";
import {UpdateMarketTask} from "@auto/ship/task/update-market";
import {PurchaseShipTask} from "@auto/ship/task/purchase-ship";
import {MineTask} from "@auto/ship/task/mine";
import {SurveyTask} from "@auto/ship/task/survey";
import {OffloadInventoryTask} from "@auto/ship/task/offload-inventory-task";
import {PickupCargoTask} from "@auto/ship/task/pickup-cargo";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {Ship} from "@auto/ship/ship";
import {TaskExecutor} from "@auto/strategy/task-executor";
import {SiphonTask} from "@auto/ship/task/siphon";

export type Task = ExploreTask | TravelTask | PurchaseTask | SellTask | UpdateMarketTask | PurchaseShipTask | MineTask | SurveyTask | OffloadInventoryTask | PickupCargoTask | SiphonTask
export interface TaskInterface<EX extends TaskExecutor<any, any>> {
  type: string;
  execute(executor: EX, orchestrator?: Orchestrator<EX, TaskInterface<any>>): Promise<void>;
  serialize(): string;
}
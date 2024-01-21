import {ObjectiveInterface, Position, TaskExecutor, TaskInterface} from "@auto/strategy/orchestrator/types";
import {Ship} from "@auto/ship/ship";
import {Orchestrator} from "@auto/strategy/orchestrator";

import {LocationSpecifier} from "@auto/strategy/types";

export abstract class AbstractTask implements TaskInterface<Ship, LocationSpecifier> {
  type: string;
  expectedDuration: number
  expectedPosition: LocationSpecifier

  constructor(type: string, expectedDuration: number, expectedPosition: LocationSpecifier) {
      this.type = type;
      this.expectedDuration = expectedDuration;
      this.expectedPosition = expectedPosition;
  }
  abstract execute(executor: Ship, orchestrator?: Orchestrator<Ship, TaskInterface, ObjectiveInterface> | undefined): Promise<void>;
  abstract serialize(): string


}
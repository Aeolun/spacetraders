import {AbstractObjective, ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import { System } from '@common/prisma'
import {Waypoint} from "spacetraders-sdk";

export class TravelObjective extends AbstractObjective {
  type: ObjectiveType.TRAVEL = ObjectiveType.TRAVEL;

  constructor(public system: System, public waypoint?: Waypoint) {
    super(`Travel to ${waypoint ? waypoint.symbol : system.symbol}`);
  }
}
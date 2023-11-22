import {TradeSymbol} from "spacetraders-sdk";
import {Ship} from "@auto/ship/ship";
import {TaskType} from "@common/prisma";
import {TaskInterface} from "@auto/ship/task/taskInterface";

export class SurveyTask implements TaskInterface {
  type = TaskType.SURVEY;
  destination: {
    systemSymbol: string;
    waypointSymbol: string;
  }
  count: number

  constructor(destination: { systemSymbol: string; waypointSymbol: string }, count: number) {
    this.destination = destination;
    this.count = count;
  }

  async execute(ship: Ship) {
    if (ship.currentWaypointSymbol !== this.destination.waypointSymbol) {
      throw new Error("Cannot survey a place we are not")
    }

    for(let i = 0; i < this.count; i++) {
      await ship.survey()
    }
  }

  serialize(): string {
    return JSON.stringify({
      destination: this.destination,
      count: this.count,
    })
  }
}
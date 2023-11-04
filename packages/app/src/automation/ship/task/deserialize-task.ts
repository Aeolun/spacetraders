import { ShipTask } from "@common/prisma";
import {Task} from "@auto/ship/task/task";
import {ExploreTask} from "@auto/ship/task/explore";
import {TravelTask} from "@auto/ship/task/travel";

export const deserializeTask = (serializedTask: ShipTask): Task => {
  if (serializedTask.type === 'TRAVEL') {
    const data = JSON.parse(serializedTask.data)
    return new TravelTask(data.destination, data.flightMode);
  } else if (serializedTask.type === 'EXPLORE') {
    const data = JSON.parse(serializedTask.data)
    return new ExploreTask(data.waypointSymbol);
  }
  throw new Error(`Trying to deserialize unknown task type ${serializedTask.type}`)
}
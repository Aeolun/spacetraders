import { Server } from "@prisma/client";
import { getBackgroundAgentToken } from "./background-agent-token";
import createApi from "@common/lib/createApi";
import { getAllShips } from "@auto/ship/getAllShips";
import {processShip} from "@common/lib/data-update/store-ship";

export async function retrieveInitialUserInfo(server: Server) {
  const token = await getBackgroundAgentToken(server);
  const api = createApi(token);
  const allShips = await getAllShips(api);
  await Promise.all(allShips.map(async (ship) => {
    return processShip(ship);
  }))
  console.log("Updated all user ships");
}

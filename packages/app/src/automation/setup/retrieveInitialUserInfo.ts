import { Server } from "@prisma/client";
import { getBackgroundAgentToken } from "./background-agent-token";
import createApi from "@auto/lib/createApi";
import { updateShips } from "@auto/ship/updateShips";

export async function retrieveInitialUserInfo(server: Server) {
  const token = await getBackgroundAgentToken(server);
  const api = createApi(token);
  await updateShips(api);
  console.log("Updated all user ships");
}

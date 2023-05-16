import {Configuration} from "spacetraders-sdk";
import fs from "fs";

export const agentToken = fs.readFileSync('.agent-token').toString()

export const configuration = new Configuration({
    accessToken: agentToken,
})
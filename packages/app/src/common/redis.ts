import {createClient} from 'redis'
import {environmentVariables} from "@common/environment-variables";

export const redisClient = createClient({
    url: `redis://${environmentVariables.redisHost}:${environmentVariables.redisPort}`,
});
redisClient.connect().catch((err) => {
  console.error(err);
});
import {createClient} from 'redis'
import {environmentVariables} from "@common/environment-variables";

export const redisClient = createClient({
    url: `redis://${environmentVariables.redisHost}:${environmentVariables.redisPort}`,
  database: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
});
redisClient.connect().catch((err) => {
  console.error(err);
});
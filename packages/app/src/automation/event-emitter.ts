import {redisClient} from "@common/redis";

export const ee = {
  emit: (type: string, data: any) => {
    redisClient.publish(type, JSON.stringify(data));
  }
}
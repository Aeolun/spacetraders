import ThrottledQueue from "throttled-queue";
import {environmentVariables} from "@common/environment-variables";

export type Queue = ReturnType<typeof createInstrumentedQueue>['executeFunction'];
const createInstrumentedQueue = (maxRequestsPerInterval: number, interval: number) => {
  const throttleQueue = ThrottledQueue(maxRequestsPerInterval, interval);
  const stats = {
    totalRequests: 0,
    recentTimeToExecute: [] as number[],
    recentTotalTime: [] as number[],
    recentExecutionTimestamp: [] as number[],
    requestsPerSecond: function() {
      return {
        last5Seconds: this.recentExecutionTimestamp.filter(t => t > Date.now() - 5000).length / 5,
        last10Seconds: this.recentExecutionTimestamp.filter(t => t > Date.now() - 10000).length / 10,
        last30Seconds: this.recentExecutionTimestamp.filter(t => t > Date.now() - 30000).length / 30,
      };
    },
    averageTimeToExecute: function() {
      return this.recentTimeToExecute.reduce((total, current) => total + current, 0) / this.recentTimeToExecute.length;
    },
    averageTotalTime: function() {
      return this.recentTotalTime.reduce((total, current) => total + current, 0) / this.recentTotalTime.length;
    }
  }
  return {
    executeFunction: <T>(fn: () => Promise<T>) => {
      const waitToExecute = Date.now();
      return throttleQueue(async () => {
        const start = Date.now();
        stats.totalRequests++;
        stats.recentTimeToExecute.push(start - waitToExecute);
        if (stats.recentTimeToExecute.length > 100) {
          stats.recentTimeToExecute.shift();
        }
        stats.recentExecutionTimestamp.push(Date.now());
        if (stats.recentExecutionTimestamp.length > 100) {
          stats.recentExecutionTimestamp.shift();
        }
        try {
          return await fn();
        } finally {

          stats.recentTotalTime.push(Date.now() - start);
          if (stats.recentTimeToExecute.length > 100) {
            stats.recentTimeToExecute.shift();
          }

        }
      });
    },
    stats
  }
}

const instrumentedForegroundQueue = createInstrumentedQueue(process.env.FOREGROUND_RATELIMIT
  ? parseFloat(process.env.FOREGROUND_RATELIMIT)
  : 2.3, 1000)
export const foregroundQueue = instrumentedForegroundQueue.executeFunction;
export const foregroundQueueStats = instrumentedForegroundQueue.stats;

const instrumentedBackgroundQueue = createInstrumentedQueue(environmentVariables.backgroundRateLimit
  ? parseFloat(environmentVariables.backgroundRateLimit)
  : 0.5, 1000)
export const backgroundQueue = instrumentedBackgroundQueue.executeFunction;
export const backgroundQueueStats = instrumentedBackgroundQueue.stats;

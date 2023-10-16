import ThrottledQueue from "throttled-queue";

export type Queue = ReturnType<typeof ThrottledQueue>;

export const foregroundQueue = ThrottledQueue(
  process.env.FOREGROUND_RATELIMIT
    ? parseInt(process.env.FOREGROUND_RATELIMIT)
    : 1,
  1000
);

// TODO: Wrap the queue so we can get RPS stats
export const backgroundQueue = ThrottledQueue(
  process.env.BACKGROUND_RATELIMIT
    ? parseInt(process.env.BACKGROUND_RATELIMIT)
    : 1,
  1000
);

import ThrottledQueue from 'throttled-queue'

export const throttle = ThrottledQueue(1, 600);

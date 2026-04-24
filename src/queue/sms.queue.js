import BullMQ from 'bullmq';
import redisConnection from '../config/redis.js';
import { config } from '../config/index.js';

const { Queue, QueueScheduler, QueueEvents } = BullMQ;

export const smsQueue = new Queue(config.redis.queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// export const smsQueueScheduler = new QueueScheduler(config.redis.queueName, {
//   connection: redisConnection,
// });

export const smsQueueEvents = new QueueEvents(config.redis.queueName, {
  connection: redisConnection,
});

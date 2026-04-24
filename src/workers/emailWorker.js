import BullMQ from 'bullmq';
import { sendMail } from '../services/awsSes.js';
import redisConnection from '../config/redis.js';
import { config } from '../config/index.js';
import logger from '../config/logger.js';

const { Worker } = BullMQ;

const worker = new Worker(
  config.redis.queueName,
  async (job) => {
    const { to, subject, html } = job.data;
    await sendMail(to, subject, html);
    logger.info(`✅ Mail sent to ${to}`);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

worker.on('failed', (job, err) => {
  logger.error(`❌ Job ${job?.id} failed: ${err.message}`);
});

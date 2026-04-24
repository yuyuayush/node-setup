import IORedis from 'ioredis';
import { config } from './index.js';
import logger from './logger.js';

const redisConnection = new IORedis(config.redis.url, {
    maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
    logger.info(' Redis Connected Successfully');
});

redisConnection.on('error', (error) => {
    logger.error(` Redis Connection Error: ${error.message}`);
});

export default redisConnection;

import mongoose from 'mongoose';
import { config } from '../../config/index.js';
import logger from '../../config/logger.js';
import { seedUsers } from './user.seeder.js';

/**
 * Main Seeder Orchestrator
 * Rules for professional seeding:
 * 1. Connection management (Open/Close properly)
 * 2. Idempotency (Optional: clean before seed)
 * 3. Environment protection (Never seed production by mistake)
 */
const runSeeder = async () => {
    // 1. Guard against production
    if (config.isProduction) {
        logger.error('CRITICAL: Cannot run seeder in production environment!');
        process.exit(1);
    }

    try {
        logger.info('Connecting to database for seeding...');
        await mongoose.connect(config.mongoose.url, config.mongoose.options);
        logger.info('Connected.');

        // 2. Optional: Clean database
        // In a real project, you might want to clear specific collections first
        logger.info('Clearing existing users...');
        await mongoose.connection.collection('users').deleteMany({});

        // 3. Execution
        await seedUsers(15); // Seed 15 users

        logger.info('Database Seeding Completed Successfully! 🚀');
    } catch (error) {
        logger.error('Seeding Failed:', error);
    } finally {
        // 4. Always close the connection
        await mongoose.disconnect();
        logger.info('Database connection closed.');
        process.exit(0);
    }
};

runSeeder();

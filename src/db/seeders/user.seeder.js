import { faker } from '@faker-js/faker';
import User from '../../models/userModel.js';
import logger from '../../config/logger.js';


const generateUser = (overrides = {}) => {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'Password123!', // Using a static password for easy dev login
        role: 'user',
        isEmailVerified: true,
        ...overrides,
    };
};

/**
 * User Seeder
 * Responsible for the persistence logic of users.
 */
export const seedUsers = async (count = 10) => {
    try {
        logger.info(`Seeding ${count} users...`);

        const users = Array.from({ length: count }, () => generateUser());

        await User.create(users);

        logger.info('Users seeded successfully');
    } catch (error) {
        logger.error('Error seeding users:', error);
        throw error;
    }
};

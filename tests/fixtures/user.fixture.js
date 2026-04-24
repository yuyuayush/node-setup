import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../src/models/userModel.js';

const password = 'password123';
const salt = 8;
const hashedPassword = await bcrypt.hash(password, salt);


export const createFakeUser = (overrides = {}) => ({
    _id: new mongoose.Types.ObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password,
    role: 'user',
    isEmailVerified: false,
    ...overrides,
});

export const userOne = createFakeUser({ name: 'User One', email: 'user1@example.com' });
export const userTwo = createFakeUser({ name: 'User Two', email: 'user2@example.com' });
export const admin = createFakeUser({ name: 'Admin', email: 'admin@example.com', role: 'admin' });


export const insertUsers = async (users) => {
    await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};


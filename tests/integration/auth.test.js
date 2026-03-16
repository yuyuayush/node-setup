import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import User from '../../src/models/userModel.js';
import { userOne, insertUsers, createFakeUser } from '../fixtures/user.fixture.js';

setupTestDB();

describe('Auth Integration Tests', () => {

    describe('POST /api/v1/auth/register', () => {
        let newUser;

        beforeEach(() => {
            const fakeUser = createFakeUser();
            newUser = {
                name: fakeUser.name,
                email: fakeUser.email,
                password: fakeUser.password,
            };
        });

        it('should return 201 and successfully register user when data is valid', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(newUser)
                .expect(httpStatus.CREATED);

            expect(res.body.data.user).not.toHaveProperty('password');
            expect(res.body.data.user).toMatchObject({
                name: newUser.name,
                email: newUser.email,
                role: 'user',
            });

            const dbUser = await User.findById(res.body.data.user.id);
            expect(dbUser).toBeDefined();
            expect(dbUser.password).not.toBe(newUser.password);
        });

        it('should return 400 when email is invalid', async () => {
            const invalidUser = createFakeUser({ email: 'not-an-email' });
            await request(app)
                .post('/api/v1/auth/register')
                .send(invalidUser)
                .expect(httpStatus.BAD_REQUEST);
        });

        it('should return 400 when email is already taken', async () => {
            await insertUsers([userOne]);
            const duplicateUser = createFakeUser({ email: userOne.email });

            await request(app)
                .post('/api/v1/auth/register')
                .send(duplicateUser)
                .expect(httpStatus.BAD_REQUEST);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await insertUsers([userOne]);
        });

        it('should return 200 and auth tokens when credentials are correct', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: userOne.email,
                    password: userOne.password
                })
                .expect(httpStatus.OK);

            expect(res.body.data.tokens).toMatchObject({
                access: { token: expect.any(String) },
                refresh: { token: expect.any(String) },
            });
        });

        it('should return 401 when password is incorrect', async () => {
            await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: userOne.email,
                    password: 'wrong-password'
                })
                .expect(httpStatus.UNAUTHORIZED);
        });
    });
});

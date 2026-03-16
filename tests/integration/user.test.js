import request from 'supertest';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import { userOne, insertUsers, admin } from '../fixtures/user.fixture.js';
import { userOneAccessToken } from '../fixtures/token.fixture.js';

setupTestDB();

describe('User routes', () => {
    describe('GET /api/v1/users', () => {
        test('should return 200 and all users if authenticated', async () => {
            await insertUsers([userOne]);

            const res = await request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .expect(200);

            expect(res.body.data.results).toHaveLength(1);
            expect(res.body.data.results[0]).toMatchObject({
                id: userOne._id.toString(),
                email: userOne.email,
            });
        });

        test('should return 401 if access token is missing', async () => {
            await request(app).get('/api/v1/users').expect(401);
        });
    });

    describe('GET /api/v1/users/:id', () => {
        test('should return 200 and user object if data is ok', async () => {
            await insertUsers([userOne]);

            const res = await request(app)
                .get(`/api/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .expect(200);

            expect(res.body.data).toMatchObject({
                id: userOne._id.toString(),
                email: userOne.email,
            });
        });

        test('should return 400 if id is not a valid mongo id', async () => {
            await insertUsers([userOne]);

            await request(app)
                .get('/api/v1/users/invalid-id')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .expect(400);
        });
    });
});

import request from 'supertest';
import app from '../../src/app.js';

describe('GET /api/v1/healthcheck', () => {
    test('should return 200 OK', async () => {
        const res = await request(app).get('/api/v1/healthcheck');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('uptime');
    });

    test('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/api/v1/unknown-route');
        expect(res.statusCode).toEqual(404);
    });
});

import express from 'express';
import userRouter from './userRoutes.js';
import authRouter from './authRoutes.js';
import docsRouter from './docsRoutes.js';
import { config } from '../config/index.js';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRouter,
    },
    {
        path: '/users',
        route: userRouter,
    },
];


defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});



// Health check route
router.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

export default router;

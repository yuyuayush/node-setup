import express from 'express';
import userRouter from './userRoutes.js';

const router = express.Router();

// Register routes
router.use('/users', userRouter);

// Health check route
router.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

export default router;

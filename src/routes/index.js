import express from 'express';
import userRouter from './userRoutes.js';
import authRouter from './authRoutes.js';
import uploadRouter from './upload.route.js';
import postRouter from './post.route.js';
import emailRouter from './email.route.js';
import productRouter from './product.routes.js';
import paymentRouter from './payment.routes.js';
import messageRouter from './message.route.js';
import { auth } from '../middleware/auth.js';

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
    {
        path: '/email',
        route: emailRouter,
    },
];
const privateRoutes = [
    {
        path: '/upload',
        route: uploadRouter,
    },
    {
        path: '/posts',
        route: postRouter,
    },
    {
        path: '/products',
        route: productRouter,
    },
    {
        path: '/payment',
        route: paymentRouter,
    },
    {
        path: '/messages',
        route: messageRouter,
    },
];


defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

privateRoutes.forEach((route) => {
    router.use(route.path, auth(), route.route);
});



// Health check route
router.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

export default router;

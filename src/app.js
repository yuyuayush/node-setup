import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/index.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import mainRouter from './routes/index.js';

const app = express();

// Base Middlewares
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));

app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Logging Middlewares
app.use(loggerMiddleware);
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1', mainRouter);

// Global Error Handling Middleware
app.use(errorMiddleware);

export default app;

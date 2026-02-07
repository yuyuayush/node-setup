import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet'; // Security Headers
import compression from 'compression'; // Response Compression
import rateLimit from 'express-rate-limit'; // Rate Limiting
import hpp from 'hpp'; // HTTP Parameter Pollution
import { config } from './config/index.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import mainRouter from './routes/index.js';

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    messge: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Performance Middleware
app.use(compression());

// Base Middlewares
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Prevent HTTP Parameter Pollution
app.use(hpp());

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

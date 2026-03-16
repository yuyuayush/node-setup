import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet'; // Security Headers
import compression from 'compression'; // Response Compression
import rateLimit from 'express-rate-limit'; // Rate Limiting
import hpp from 'hpp'; // HTTP Parameter Pollution
import { config } from './config/index.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import { errorConverter, errorHandler } from './middleware/errorMiddleware.js';
import { ApiError } from './utils/ApiError.js';
import mainRouter from './routes/index.js';

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.env === 'test',
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
if (config.env === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1', mainRouter);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;

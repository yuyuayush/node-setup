import express from 'express';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';
import logger from '../config/logger.js';

const errorMiddleware = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!(err instanceof ApiError)) {
        statusCode = statusCode || 500;
        message = message || "Internal Server Error";
    }

    const response = {
        success: false,
        message,
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
        errors: err.errors || []
    };

    logger.error(`${statusCode} - ${message} - ${req.method} ${req.originalUrl} - ${req.ip}`);

    res.status(statusCode).json(response);
};

export default errorMiddleware;

import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';
import logger from '../config/logger.js';

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? 400 : 500;
        const message = error.message || (statusCode === 400 ? 'Bad Request' : 'Internal Server Error');
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.isProduction && !err.isOperational) {
        statusCode = 500;
        message = 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        success: false,
        statusCode,
        message,
        ...(!config.isProduction && { stack: err.stack }),
    };

    if (!config.isProduction) {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };

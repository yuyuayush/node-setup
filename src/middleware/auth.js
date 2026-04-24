import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/userModel.js';
import logger from '../config/logger.js';

export const auth = () => asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    logger.info("auth", token);

    if (!token) {
        throw new ApiError(401, 'Please authenticate');
    }

    try {
        const payload = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(payload.sub);
        if (!user) {
            throw new ApiError(401, 'User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, 'Please authenticate');
    }
});

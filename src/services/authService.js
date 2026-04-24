import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import * as userService from './userService.js';

export const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(401, 'Incorrect email or password');
    }
    return user;
};

export const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenPayload = jwt.verify(refreshToken, config.jwt.secret);
        const user = await userService.getUserById(refreshTokenPayload.sub);
        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, "Please authenticate");
        }
        return user;
    } catch (error) {
        throw new ApiError(401, 'Please authenticate');
    }
};

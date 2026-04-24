import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import User from '../models/userModel.js';

export const generateToken = (userId, expires, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(expires.getTime() / 1000),
    };
    return jwt.sign(payload, secret);
};

export const generateAuthTokens = async (user) => {
    const accessTokenExpires = new Date();
    accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + config.jwt.accessExpirationMinutes);
    const accessToken = generateToken(user.id, accessTokenExpires);

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + config.jwt.refreshExpirationDays);
    const refreshToken = generateToken(user.id, refreshTokenExpires);

    // Store the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires,
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires,
        },
    };
};

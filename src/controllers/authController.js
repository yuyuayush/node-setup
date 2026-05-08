import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseHandler.js';
import { authService, userService, tokenService } from '../services/index.js';
import logger from '../config/logger.js';

export const register = asyncHandler(async (req, res) => {
    logger.info(`Registering user: ${req.body.email}`);
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    logger.info(`User registered successfully: ${user.email}`);
    return successResponse(res, { user, tokens }, "User registered successfully", 201);
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    return successResponse(res, { user, tokens }, "Login successful");
});

export const refreshTokens = asyncHandler(async (req, res) => {
    const user = await authService.refreshAuth(req.body.refreshToken);
    const tokens = await tokenService.generateAuthTokens(user);
    return successResponse(res, { ...tokens }, "Tokens refreshed successfully");
});

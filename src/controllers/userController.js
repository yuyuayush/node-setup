import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as userService from '../services/userService.js';

/**
 * @description Get all users
 * @route GET /api/v1/users
 */
export const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});

/**
 * @description Get user by ID
 * @route GET /api/v1/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
});

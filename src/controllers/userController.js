import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { successResponse } from '../utils/responseHandler.js';
import { userService } from '../services/index.js';

export const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    return successResponse(res, user, "User created successfully", 201);
});

export const getUsers = asyncHandler(async (req, res) => {
    const filter = {};
    const options = {
        sortBy: req.query.sortBy,
        limit: req.query.limit,
        page: req.query.page,
    };
    const result = await userService.queryUsers(filter, options);
    return successResponse(res, result, "Users fetched successfully");
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return successResponse(res, user, "User fetched successfully");
});

export const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUserById(req.params.id, req.body);
    return successResponse(res, user, "User updated successfully");
});

export const deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUserById(req.params.id);
    return successResponse(res, null, "User deleted successfully", 204);
});

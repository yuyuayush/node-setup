import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';

export const createUser = async (userBody) => {
    return User.create(userBody);
};

export const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

export const getUserById = async (id) => {
    return User.findById(id);
};

export const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

export const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(400, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

export const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    await user.deleteOne();
    return user;
};

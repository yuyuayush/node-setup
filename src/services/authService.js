import { ApiError } from '../utils/ApiError.js';
import * as userService from './userService.js';

export const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(401, 'Incorrect email or password');
    }
    return user;
};

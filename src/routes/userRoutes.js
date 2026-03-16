import express from 'express';
import * as userController from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { userValidation } from '../validations/index.js';

const router = express.Router();

router
    .route('/')
    .get(auth(), validate(userValidation.getUsers), userController.getUsers)
    .post(auth(), validate(userValidation.createUser), userController.createUser);

router
    .route('/:id')
    .get(auth(), validate(userValidation.getUser), userController.getUserById)
    .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
    .delete(auth(), validate(userValidation.deleteUser), userController.deleteUser);

export default router;

import express from 'express';
import * as authController from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import { authValidation } from '../validations/index.js';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);

export default router;

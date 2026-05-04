import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerValidation, loginValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);

export default router;
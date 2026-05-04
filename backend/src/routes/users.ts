import { Router } from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { updateProfileValidation } from '../validations/user.validation';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, validate(updateProfileValidation), updateProfile);
router.delete('/me', authenticate, deleteProfile);

export default router;
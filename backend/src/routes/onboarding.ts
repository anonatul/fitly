import { Router } from 'express';
import { complete, regenerate } from '../controllers/onboardingController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { onboardingValidation } from '../validations/onboarding.validation';

const router = Router();

router.post('/complete', authenticate, validate(onboardingValidation), complete);
router.post('/regenerate', authenticate, regenerate);

export default router;
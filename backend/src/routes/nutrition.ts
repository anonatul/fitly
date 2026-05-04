import { Router } from 'express';
import {
  createMealLog,
  listMealLogs,
  getDailySummary,
  removeMealLog,
} from '../controllers/nutritionController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { logMealValidation } from '../validations/nutrition.validation';

const router = Router();

router.post('/log', authenticate, validate(logMealValidation), createMealLog);
router.get('/logs', authenticate, listMealLogs);
router.get('/daily', authenticate, getDailySummary);
router.delete('/log/:id', authenticate, removeMealLog);

export default router;
import { Router } from 'express';
import { listExercises, getExercise } from '../controllers/exerciseController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, listExercises);
router.get('/:id', authenticate, getExercise);

export default router;
import { Router } from 'express';
import { 
  listWorkouts,
  getWorkout,
  createNewWorkout,
  updateExistingWorkout,
  removeWorkout,
  startExistingWorkout,
  finishWorkout,
} from '../controllers/workoutController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createWorkoutValidation, updateWorkoutValidation } from '../validations/workout.validation';

const router = Router();

router.get('/', authenticate, listWorkouts);
router.get('/:id', authenticate, getWorkout);
router.post('/', authenticate, validate(createWorkoutValidation), createNewWorkout);
router.put('/:id', authenticate, validate(updateWorkoutValidation), updateExistingWorkout);
router.delete('/:id', authenticate, removeWorkout);
router.post('/:id/start', authenticate, startExistingWorkout);
router.post('/:id/complete', authenticate, finishWorkout);

export default router;
import { body } from 'express-validator';

export const createWorkoutValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  body('scheduledAt').optional().isISO8601().withMessage('Valid date required'),
  body('exercises').optional().isArray().withMessage('Exercises must be an array'),
  body('exercises.*.exerciseId').optional().isUUID().withMessage('Valid exercise ID required'),
  body('exercises.*.sets').optional().isInt({ min: 1 }).withMessage('Sets must be at least 1'),
  body('exercises.*.reps').optional().isInt({ min: 1 }).withMessage('Reps must be at least 1'),
  body('exercises.*.duration').optional().isInt({ min: 1 }),
  body('exercises.*.weight').optional().isFloat({ min: 0 }),
  body('exercises.*.restTime').optional().isInt({ min: 0 }),
];

export const updateWorkoutValidation = [
  body('name').optional().trim().notEmpty(),
  body('status').optional().isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
];

export const logExerciseValidation = [
  body('workoutId').optional().isUUID(),
  body('exerciseId').isUUID().withMessage('Exercise ID required'),
  body('setsCompleted').isInt({ min: 1 }).withMessage('Sets completed required'),
  body('repsCompleted').optional().isInt({ min: 1 }),
  body('duration').optional().isInt({ min: 1 }),
  body('weightUsed').optional().isFloat({ min: 0 }),
];
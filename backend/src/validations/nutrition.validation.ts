import { body } from 'express-validator';

export const logMealValidation = [
  body('mealType').isIn(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']).withMessage('Valid meal type required'),
  body('name').trim().notEmpty().withMessage('Meal name required'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories required'),
  body('protein').optional().isFloat({ min: 0 }),
  body('carbs').optional().isFloat({ min: 0 }),
  body('fat').optional().isFloat({ min: 0 }),
];
import { body } from 'express-validator';

export const onboardingValidation = [
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender required'),
  body('age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('weight').isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30-300 kg'),
  body('height').isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100-250 cm'),
  body('activityLevel').isIn(['light', 'moderate', 'intensive']).withMessage('Valid activity level required'),
  body('waterIntake').isFloat({ min: 0, max: 10 }).withMessage('Water intake must be 0-10 liters'),
  body('goal').isIn(['lose_weight', 'maintain', 'build_muscle']).withMessage('Valid goal required'),
  body('daysPerWeek').isInt({ min: 4, max: 5 }).withMessage('Days per week must be 4 or 5'),
];
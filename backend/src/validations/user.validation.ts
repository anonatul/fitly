import { body } from 'express-validator';

export const updateProfileValidation = [
  body('name').optional().trim().notEmpty(),
  body('height').optional().isFloat({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 }),
];
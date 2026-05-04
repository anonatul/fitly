import request from 'supertest';
import app from '../src/app';
import { validationResult } from 'express-validator';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      deleteMany: jest.fn().mockResolvedValue({}),
    },
    $disconnect: jest.fn().mockResolvedValue({}),
  })),
}));

describe('Onboarding API Validation', () => {
  describe('POST /api/onboarding/complete', () => {
    it('should return 401 without auth header', async () => {
      const response = await request(app)
        .post('/api/onboarding/complete')
        .send({
          gender: 'male',
          age: 25,
          weight: 75,
          height: 180,
          activityLevel: 'moderate',
          waterIntake: 2.5,
          goal: 'build_muscle',
          daysPerWeek: 5,
        });

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/onboarding/complete')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          gender: 'male',
          age: 25,
          weight: 75,
          height: 180,
          activityLevel: 'moderate',
          waterIntake: 2.5,
          goal: 'build_muscle',
          daysPerWeek: 5,
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing validation fields', async () => {
      const response = await request(app)
        .post('/api/onboarding/complete')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          gender: 'male',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/onboarding/regenerate', () => {
    it('should return 401 without auth header', async () => {
      const response = await request(app)
        .post('/api/onboarding/regenerate');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/onboarding/regenerate')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
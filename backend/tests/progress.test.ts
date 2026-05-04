import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let userToken: string;

describe('Progress API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'progress@test.com',
        password: 'password123',
        name: 'Progress Test User',
      });
    
    userToken = registerRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/progress/body', () => {
    it('should log body metrics', async () => {
      const response = await request(app)
        .post('/api/progress/body')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          weight: 75,
          bodyFat: 18,
          muscleMass: 32,
        });
      
      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/progress/body', () => {
    it('should get body metrics history', async () => {
      const response = await request(app)
        .get('/api/progress/body')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/progress/analytics', () => {
    it('should get progress analytics', async () => {
      const response = await request(app)
        .get('/api/progress/analytics')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
    });
  });
});
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let userToken: string;

describe('Nutrition API', () => {
  beforeAll(async () => {
    await prisma.nutritionLog.deleteMany();
    await prisma.user.deleteMany();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'nutrition@test.com',
        password: 'password123',
        name: 'Nutrition Test User',
      });
    
    userToken = registerRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/nutrition/log', () => {
    it('should log a meal', async () => {
      const response = await request(app)
        .post('/api/nutrition/log')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          mealType: 'BREAKFAST',
          name: 'Oatmeal',
          calories: 300,
          protein: 10,
          carbs: 50,
          fat: 5,
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('Oatmeal');
    });
  });

  describe('GET /api/nutrition/logs', () => {
    it('should get nutrition logs', async () => {
      const response = await request(app)
        .get('/api/nutrition/logs')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/nutrition/daily', () => {
    it('should get daily nutrition summary', async () => {
      const response = await request(app)
        .get('/api/nutrition/daily')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('totalCalories');
    });
  });

  describe('DELETE /api/nutrition/log/:id', () => {
    it('should delete a nutrition log', async () => {
      const logResponse = await request(app)
        .post('/api/nutrition/log')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          mealType: 'LUNCH',
          name: 'Salad',
          calories: 200,
        });
      
      const logId = logResponse.body.data.id;
      
      const deleteResponse = await request(app)
        .delete(`/api/nutrition/log/${logId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(deleteResponse.status).toBe(200);
    });
  });
});
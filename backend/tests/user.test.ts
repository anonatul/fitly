import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let userToken: string;
let userId: string;

describe('User API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'profile@test.com',
        password: 'password123',
        name: 'Profile Test User',
      });
    
    userToken = registerRes.body.token;
    userId = registerRes.body.user.id;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('email');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated Name',
          height: 180,
          weight: 75,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Name');
    });
  });
});
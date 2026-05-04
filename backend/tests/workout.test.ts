import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let userToken: string;

describe('Workout API', () => {
  let workoutId: string;
  let exerciseId: string;
  
  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.exercise.deleteMany();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'workout@test.com',
        password: 'password123',
        name: 'Workout Test User',
      });
    
    userToken = registerRes.body.token;
    
    const exercise = await prisma.exercise.create({
      data: {
        name: 'Push Up',
        description: 'Classic push up exercise',
        muscleGroup: 'CHEST',
        equipment: [],
        caloriesPerMinute: 7.5,
      },
    });
    exerciseId = exercise.id;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/workouts', () => {
    it('should create a new workout', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Morning Workout',
          description: 'Full body workout',
          scheduledAt: new Date().toISOString(),
          exercises: [
            {
              exerciseId,
              sets: 3,
              reps: 12,
              restTime: 60,
            },
          ],
        });
      
      expect(response.status).toBe(201);
      workoutId = response.body.data.id;
    });
  });

  describe('GET /api/workouts', () => {
    it('should list user workouts', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
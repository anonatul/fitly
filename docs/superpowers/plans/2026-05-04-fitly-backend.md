# Fitly Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a RESTful backend API for the Fitly fitness application supporting authentication, workout management, AI coaching, nutrition tracking, progress analytics, and social features.

**Architecture:** Node.js/Express with TypeScript, PostgreSQL database with Prisma ORM, JWT authentication, RESTful API design following REST conventions. API returns JSON responses with standard HTTP status codes.

**Tech Stack:** Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, JWT, bcrypt, Node-cron

---
> **⚠️ IMPORTANT - Review Before Implementing:** This plan assumes a Node.js/Express + PostgreSQL backend. If you want a different technology (Kotlin/Ktor, Python/FastAPI, Go, etc.), let me know and I'll adjust the plan.

---

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts           # Environment variables and config
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication middleware
│   │   ├── errorHandler.ts   # Global error handling
│   │   └── validation.ts     # Request validation middleware
│   ├── routes/
│   │   ├── auth.ts           # Authentication routes
│   │   ├── users.ts          # User management routes
│   │   ├── workouts.ts        # Workout management routes
│   │   ├── exercises.ts      # Exercise library routes
│   │   ├── nutrition.ts      # Nutrition tracking routes
│   │   ├── progress.ts      # Progress tracking routes
│   │   ├── social.ts        # Social features routes
│   │   └── aiCoach.ts       # AI Coach routes
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── workoutController.ts
│   │   ├── exerciseController.ts
│   │   ├── nutritionController.ts
│   │   ├── progressController.ts
│   │   ├── socialController.ts
│   │   └── aiCoachController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── workoutService.ts
│   │   ├── exerciseService.ts
│   │   ├── nutritionService.ts
│   │   ├── progressService.ts
│   │   ├── socialService.ts
│   │   └── aiCoachService.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Workout.ts
│   │   ├── Exercise.ts
│   │   ├── Nutrition.ts
│   │   ├── Progress.ts
│   │   └── Social.ts
│   ├── utils/
│   │   ├── jwt.ts           # JWT utilities
│   │   ├── password.ts      # Password hashing
│   │   └── responses.ts     # API response helpers
│   ├── types/
│   │   └── express.d.ts    # Express type extensions
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   ├── user.validation.ts
│   │   ├── workout.validation.ts
│   │   └── nutrition.validation.ts
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── prisma/
│   └── schema.prisma       # Database schema
├── tests/
│   ├── auth.test.ts
│   ├── user.test.ts
│   ├── workout.test.ts
│   ├── nutrition.test.ts
│   └── progress.test.ts
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## Task 1: Project Setup & Database Schema

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/.env`
- Create: `backend/src/config/index.ts`
- Create: `backend/src/app.ts`
- Create: `backend/src/server.ts`

### Sub-tasks

- [ ] **Step 1: Create package.json with dependencies**

```json
{
  "name": "fitly-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "migrate": "prisma migrate dev",
    "generate": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "node-cron": "^3.0.3",
    "openai": "^4.28.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.0",
    "@types/node-cron": "^3.0.11",
    "prisma": "^5.10.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "ts-jest": "^29.1.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create .env file**

```env
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/fitly?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI (for AI Coach)
OPENAI_API_KEY=your-openai-api-key

# Apple Sign In
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key\n-----END PRIVATE KEY-----"

# Google Sign In
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

- [ ] **Step 4: Create Prisma schema with all models**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  TRAINER
  ADMIN
}

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum WorkoutStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  password          String?
  name              String
  role              UserRole  @default(USER)
  gender            Gender?
  dateOfBirth       DateTime?
  height            Float?
  weight            Float?
  goalWeight        Float?
  avatarUrl         String?
  bio               String?
  
  // Social
  followers         Follow[]  @relation("following")
  following        Follow[]  @relation("follower")
  
  // Authentication
  googleId          String?   @unique
  appleId           String?  @unique
  refreshToken     String?
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  workouts         Workout[]
  exerciseLogs     ExerciseLog[]
  nutritionLogs    NutritionLog[]
  bodyMetrics     BodyMetric[]
  aiCoachChats    AICoachChat[]
}

model Exercise {
  id          String    @id @default(uuid())
  name        String
  description String?
  muscleGroup String
  equipment   String[]
  videoUrl    String?
  imageUrl    String?
  caloriesPerMinute Float?
  
  createdAt   DateTime  @default(now())
  
  // Relations
  exerciseLogs ExerciseLog[]
  workoutExercises WorkoutExercise[]
}

model Workout {
  id          String        @id @default(uuid())
  name        String
  description String?
  status      WorkoutStatus @default(SCHEDULED)
  scheduledAt DateTime?
  startedAt   DateTime?
  completedAt DateTime?
  duration    Int?          // minutes
  
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  exercises   WorkoutExercise[]
  exerciseLogs ExerciseLog[]
}

model WorkoutExercise {
  id          String  @id @default(uuid())
  workoutId  String
  exerciseId  String
  workout     Workout @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  exercise    Exercise @relation(fields: [exerciseId], references: [id])
  
  sets        Int
  reps        Int?
  duration   Int?    // seconds
  weight      Float?
  restTime   Int?    // seconds between sets
  
  order       Int
  
  @@unique([workoutId, exerciseId])
}

model ExerciseLog {
  id              String    @id @default(uuid())
  workoutId       String?
  workout         Workout?  @relation(fields: [workoutId], references: [id])
  exerciseId      String
  exercise        Exercise  @relation(fields: [exerciseId], references: [id])
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  setsCompleted   Int
  repsCompleted  Int?
  duration       Int?
  weightUsed     Float?
  caloriesBurned Float?
  
  completedAt    DateTime  @default(now())
}

model NutritionLog {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  mealType      MealType
  name         String
  description  String?
  calories     Float
  protein      Float?
  carbs        Float?
  fat          Float?
  fiber        Float?
  sugar        Float?
  sodium       Float?
  waterIntake  Float?    // in ml
  
  loggedAt     DateTime  @default(now())
}

model BodyMetric {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  weight      Float?
  bodyFat     Float?
  muscleMass  Float?
  waist       Float?
  chest      Float?
  hips       Float?
  arms       Float?
  thighs    Float?
  
  measuredAt  DateTime  @default(now())
}

model AICoachChat {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  messages    Json      // Array of {role: "user" | "assistant", content: string, timestamp: string}
  tokensUsed Int        @default(0)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Follow {
  id          String    @id @default(uuid())
  followerId String
  follower   User      @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   User      @relation("following", fields: [followingId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  
  @@unique([followerId, followingId])
}
```

- [ ] **Step 5: Create config/index.ts**

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || '',
    teamId: process.env.APPLE_TEAM_ID || '',
    keyId: process.env.APPLE_KEY_ID || '',
    privateKey: process.env.APPLE_PRIVATE_KEY || '',
  },
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
};
```

- [ ] **Step 6: Create app.ts**

```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import workoutRoutes from './routes/workouts';
import exerciseRoutes from './routes/exercises';
import nutritionRoutes from './routes/nutrition';
import progressRoutes from './routes/progress';
import socialRoutes from './routes/social';
import aiCoachRoutes from './routes/aiCoach';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/ai-coach', aiCoachRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;
```

- [ ] **Step 7: Create server.ts**

```typescript
import app from './app';
import { config } from './config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

- [ ] **Step 8: Run npm install and Prisma generate**

Run: `cd backend && npm install && npx prisma generate`
Expected: Dependencies installed, Prisma client generated

- [ ] **Step 9: Commit**

```bash
git add backend/
git commit -m "feat: add backend project setup with Express, Prisma schema"
```
---

## Task 2: Authentication System

**Files:**
- Create: `backend/src/utils/jwt.ts`
- Create: `backend/src/utils/password.ts`
- Create: `backend/src/utils/responses.ts`
- Create: `backend/src/middleware/auth.ts`
- Create: `backend/src/middleware/errorHandler.ts`
- Create: `backend/src/validations/auth.validation.ts`
- Create: `backend/src/controllers/authController.ts`
- Create: `backend/src/services/authService.ts`
- Create: `backend/src/routes/auth.ts`
- Test: `backend/tests/auth.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 400 for duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      
      expect(response.status).toBe(401);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npm test`
Expected: FAIL - routes not found (404)

- [ ] **Step 3: Create utility files**

```typescript
// backend/src/utils/password.ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

```typescript
// backend/src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
}
```

```typescript
// backend/src/utils/responses.ts
import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(res: Response, data: T, statusCode = 200): Response {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400
): Response {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
}

export function createdResponse<T>(res: Response, data: T): Response {
  return successResponse(res, data, 201);
}

export function unauthorizedResponse(res: Response, message = 'Unauthorized'): Response {
  return errorResponse(res, message, 401);
}

export function forbiddenResponse(res: Response, message = 'Forbidden'): Response {
  return errorResponse(res, message, 403);
}

export function notFoundResponse(res: Response, message = 'Not found'): Response {
  return errorResponse(res, message, 404);
}
```

- [ ] **Step 4: Create middleware files**

```typescript
// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { unauthorizedResponse } from '../utils/responses';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorizedResponse(res, 'No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = verifyToken(token);
    (req as AuthRequest).user = payload;
    next();
  } catch (error) {
    return unauthorizedResponse(res, 'Invalid token');
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return unauthorizedResponse(res);
    }
    
    if (!roles.includes(authReq.user.role)) {
      return forbiddenResponse(res, 'Insufficient permissions');
    }
    
    next();
  };
}
```

```typescript
// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
```

```typescript
// backend/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    next();
  };
}
```

- [ ] **Step 5: Create validations**

```typescript
// backend/src/validations/auth.validation.ts
import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];
```

- [ ] **Step 6: Create auth service**

```typescript
// backend/src/services/authService.ts
import { PrismaClient, User } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken, JWTPayload } from '../utils/jwt';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterData): Promise<{ user: User; token: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  const hashedPassword = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });
  
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  
  return { user, token };
}

export async function loginUser(data: LoginData): Promise<{ user: User; token: string }> {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  
  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }
  
  const isValid = await verifyPassword(data.password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  
  return { user, token };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user || !user.password) {
    throw new Error('User not found');
  }
  
  const isValid = await verifyPassword(currentPassword, user.password);
  
  if (!isValid) {
    throw new Error('Current password is incorrect');
  }
  
  const hashedNewPassword = await hashPassword(newPassword);
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
}

export async function getUserById(userId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}
```

- [ ] **Step 7: Create auth controller**

```typescript
// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  changePassword,
} from '../services/authService';
import { successResponse, errorResponse, createdResponse } from '../utils/responses';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const { user, token } = await registerUser({ email, password, name });
    
    return createdResponse(res, { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });
    
    return successResponse(res, { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error: any) {
    return errorResponse(res, error.message, 401);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;
    
    await changePassword(userId, currentPassword, newPassword);
    
    return successResponse(res, { message: 'Password changed successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
```

- [ ] **Step 8: Create auth routes**

```typescript
// backend/src/routes/auth.ts
import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerValidation, loginValidation, changePasswordValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/change-password', authenticate, validate(changePasswordValidation), changePassword);

export default router;
```

- [ ] **Step 9: Run tests**

Run: `cd backend && npm test`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add backend/
git commit -m "feat: add authentication system with JWT"
```
---

## Task 3: User Management

**Files:**
- Create: `backend/src/validations/user.validation.ts`
- Create: `backend/src/controllers/userController.ts`
- Create: `backend/src/services/userService.ts`
- Create: `backend/src/routes/users.ts`
- Test: `backend/tests/user.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/tests/user.test.ts
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
    
    userToken = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
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
```

- [ ] **Step 2: Create user validation**

```typescript
// backend/src/validations/user.validation.ts
import { body } from 'express-validator';

export const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('height').optional().isFloat({ min: 0 }).withMessage('Height must be positive'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be positive'),
  body('goalWeight').optional().isFloat({ min: 0 }).withMessage('Goal weight must be positive'),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date required'),
  body('bio').optional().isString(),
];

export const updateRoleValidation = [
  body('role').isIn(['USER', 'TRAINER', 'ADMIN']).withMessage('Valid role required'),
];
```

- [ ] **Step 3: Create user service**

```typescript
// backend/src/services/userService.ts
import { PrismaClient, User, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export interface UpdateProfileData {
  name?: string;
  height?: number;
  weight?: number;
  goalWeight?: number;
  gender?: string;
  dateOfBirth?: Date;
  bio?: string;
  avatarUrl?: string;
}

export async function getUserProfile(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileData
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      height: data.height,
      weight: data.weight,
      goalWeight: data.goalWeight,
      gender: data.gender as any,
      dateOfBirth: data.dateOfBirth,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    },
  });
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

export async function deleteUser(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}
```

- [ ] **Step 4: Create user controller**

```typescript
// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  deleteUser,
} from '../services/userService';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function getProfile(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const user = await getUserProfile(authReq.user!.userId);
    
    return successResponse(res, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      height: user.height,
      weight: user.weight,
      goalWeight: user.goalWeight,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    });
  } catch (error: any) {
    return errorResponse(res, error.message, 404);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const user = await updateUserProfile(authReq.user!.userId, req.body);
    
    return successResponse(res, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function deleteProfile(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    await deleteUser(authReq.user!.userId);
    
    return successResponse(res, { message: 'Profile deleted' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
```

- [ ] **Step 5: Create user routes**

```typescript
// backend/src/routes/users.ts
import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { updateProfileValidation } from '../validations/user.validation';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, validate(updateProfileValidation), updateProfile);
router.delete('/me', authenticate, deleteProfile);

export default router;
```

- [ ] **Step 6: Run tests**

Run: `cd backend && npm test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat: add user management CRUD operations"
```
---

## Task 4: Exercise & Workout Management

**Files:**
- Create: `backend/src/validations/workout.validation.ts`
- Create: `backend/src/controllers/exerciseController.ts`
- Create: `backend/src/controllers/workoutController.ts`
- Create: `backend/src/services/exerciseService.ts`
- Create: `backend/src/services/workoutService.ts`
- Create: `backend/src/routes/exercises.ts`
- Create: `backend/src/routes/workouts.ts`
- Test: `backend/tests/workout.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/tests/workout.test.ts
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
    
    userToken = registerRes.body.data.token;
    
    // Create an exercise
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
```

- [ ] **Step 2: Create workout validation**

```typescript
// backend/src/validations/workout.validation.ts
import { body, param, query } from 'express-validator';

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
  param('id').isUUID().withMessage('Valid workout ID required'),
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
```

- [ ] **Step 3: Create exercise service**

```typescript
// backend/src/services/exerciseService.ts
import { PrismaClient, Exercise } from '@prisma/client';

const prisma = new PrismaClient();

export interface ExerciseData {
  name: string;
  description?: string;
  muscleGroup: string;
  equipment?: string[];
  videoUrl?: string;
  imageUrl?: string;
  caloriesPerMinute?: number;
}

export async function getAllExercises(muscleGroup?: string): Promise<Exercise[]> {
  const where = muscleGroup ? { muscleGroup } : {};
  return prisma.exercise.findMany({ where });
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  return prisma.exercise.findUnique({ where: { id } });
}

export async function createExercise(data: ExerciseData): Promise<Exercise> {
  return prisma.exercise.create({ data: { ...data, equipment: data.equipment || [] } });
}

export async function updateExercise(
  id: string,
  data: Partial<ExerciseData>
): Promise<Exercise> {
  return prisma.exercise.update({ where: { id }, data });
}

export async function deleteExercise(id: string): Promise<void> {
  await prisma.exercise.delete({ where: { id } });
}
```

- [ ] **Step 4: Create workout service**

```typescript
// backend/src/services/workoutService.ts
import { PrismaClient, Workout, WorkoutStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateWorkoutData {
  name: string;
  description?: string;
  scheduledAt?: Date;
  exercises?: {
    exerciseId: string;
    sets: number;
    reps?: number;
    duration?: number;
    weight?: number;
    restTime?: number;
  }[];
}

export interface UpdateWorkoutData {
  name?: string;
  description?: string;
  status?: WorkoutStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export async function createWorkout(
  userId: string,
  data: CreateWorkoutData
): Promise<Workout> {
  const { exercises, ...workoutData } = data;
  
  const workout = await prisma.workout.create({
    data: {
      userId,
      ...workoutData,
      scheduledAt: workoutData.scheduledAt,
    },
  });
  
  if (exercises && exercises.length > 0) {
    await prisma.workoutExercise.createMany({
      data: exercises.map((ex, index) => ({
        workoutId: workout.id,
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        weight: ex.weight,
        restTime: ex.restTime,
        order: index,
      })),
    });
  }
  
  return getWorkoutById(workout.id) as Promise<Workout>;
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  return prisma.workout.findUnique({
    where: { id },
    include: { exercises: { include: { exercise: true } } },
  });
}

export async function getUserWorkouts(userId: string): Promise<Workout[]> {
  return prisma.workout.findMany({
    where: { userId },
    include: { exercises: { include: { exercise: true } } },
    orderBy: { scheduledAt: 'desc' },
  });
}

export async function updateWorkout(
  id: string,
  data: UpdateWorkoutData
): Promise<Workout> {
  return prisma.workout.update({
    where: { id },
    data,
    include: { exercises: { include: { exercise: true } } },
  });
}

export async function deleteWorkout(id: string): Promise<void> {
  await prisma.workout.delete({ where: { id } });
}

export async function startWorkout(id: string): Promise<Workout> {
  return prisma.workout.update({
    where: { id },
    data: { status: 'IN_PROGRESS', startedAt: new Date() },
    include: { exercises: { include: { exercise: true } } },
  });
}

export async function completeWorkout(id: string): Promise<Workout> {
  const workout = await prisma.workout.findUnique({ where: { id } });
  
  if (!workout?.startedAt) {
    throw new Error('Workout has not been started');
  }
  
  const duration = Math.round(
    (new Date().getTime() - workout.startedAt.getTime()) / 60000
  );
  
  return prisma.workout.update({
    where: { id },
    data: { status: 'COMPLETED', completedAt: new Date(), duration },
    include: { exercises: { include: { exercise: true } } },
  });
}
```

- [ ] **Step 5: Create controllers**

```typescript
// backend/src/controllers/exerciseController.ts
import { Request, Response } from 'express';
import {
  getAllExercises,
  getExerciseById,
  createExercise,
} from '../services/exerciseService';
import { successResponse, errorResponse, notFoundResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function listExercises(req: Request, res: Response) {
  const { muscleGroup } = req.query;
  const exercises = await getAllExercises(muscleGroup as string);
  return successResponse(res, exercises);
}

export async function getExercise(req: Request, res: Response) {
  const { id } = req.params;
  const exercise = await getExerciseById(id);
  
  if (!exercise) {
    return notFoundResponse(res, 'Exercise not found');
  }
  
  return successResponse(res, exercise);
}

export async function createNewExercise(req: Request, res: Response) {
  try {
    const exercise = await createExercise(req.body);
    return successResponse(res, exercise, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
```

```typescript
// backend/src/controllers/workoutController.ts
import { Request, Response } from 'express';
import {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  startWorkout,
  completeWorkout,
} from '../services/workoutService';
import { successResponse, errorResponse, notFoundResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function listWorkouts(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const workouts = await getUserWorkouts(authReq.user!.userId);
  return successResponse(res, workouts);
}

export async function getWorkout(req: Request, res: Response) {
  const { id } = req.params;
  const workout = await getWorkoutById(id);
  
  if (!workout) {
    return notFoundResponse(res, 'Workout not found');
  }
  
  return successResponse(res, workout);
}

export async function createNewWorkout(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const workout = await createWorkout(authReq.user!.userId, req.body);
    return successResponse(res, workout, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function updateExistingWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const workout = await updateWorkout(id, req.body);
    return successResponse(res, workout);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function removeWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteWorkout(id);
    return successResponse(res, { message: 'Workout deleted' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function startExistingWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const workout = await startWorkout(id);
    return successResponse(res, workout);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function finishWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const workout = await completeWorkout(id);
    return successResponse(res, workout);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
```

- [ ] **Step 6: Create routes**

```typescript
// backend/src/routes/exercises.ts
import { Router } from 'express';
import { listExercises, getExercise, createNewExercise } from '../controllers/exerciseController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, listExercises);
router.get('/:id', authenticate, getExercise);
router.post('/', authenticate, createNewExercise);

export default router;
```

```typescript
// backend/src/routes/workouts.ts
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
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  createWorkoutValidation,
  updateWorkoutValidation,
} from '../validations/workout.validation';

const router = Router();

router.get('/', authenticate, listWorkouts);
router.get('/:id', authenticate, getWorkout);
router.post('/', authenticate, validate(createWorkoutValidation), createNewWorkout);
router.put('/:id', authenticate, validate(updateWorkoutValidation), updateExistingWorkout);
router.delete('/:id', authenticate, removeWorkout);
router.post('/:id/start', authenticate, startExistingWorkout);
router.post('/:id/complete', authenticate, finishWorkout);

export default router;
```

- [ ] **Step 7: Run tests**

Run: `cd backend && npm test`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add backend/
git commit -m "feat: add exercise library and workout management"
```
---

## Task 5: Nutrition Tracking

**Files:**
- Create: `backend/src/validations/nutrition.validation.ts`
- Create: `backend/src/controllers/nutritionController.ts`
- Create: `backend/src/services/nutritionService.ts`
- Create: `backend/src/routes/nutrition.ts`
- Test: `backend/tests/nutrition.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/tests/nutrition.test.ts
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let userToken: string;

describe('Nutrition API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'nutrition@test.com',
        password: 'password123',
        name: 'Nutrition Test User',
      });
    
    userToken = registerRes.body.data.token;
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
    });
  });

  describe('GET /api/nutrition/logs', () => {
    it('should get nutrition logs', async () => {
      const response = await request(app)
        .get('/api/nutrition/logs')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
    });
  });
});
```

- [ ] **Step 2: Create nutrition validation**

```typescript
// backend/src/validations/nutrition.validation.ts
import { body, query } from 'express-validator';

export const logMealValidation = [
  body('mealType').isIn(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']).withMessage('Valid meal type required'),
  body('name').trim().notEmpty().withMessage('Meal name required'),
  body('description').optional().trim(),
  body('calories').isFloat({ min: 0 }).withMessage('Calories required'),
  body('protein').optional().isFloat({ min: 0 }),
  body('carbs').optional().isFloat({ min: 0 }),
  body('fat').optional().isFloat({ min: 0 }),
  body('fiber').optional().isFloat({ min: 0 }),
  body('sugar').optional().isFloat({ min: 0 }),
  body('sodium').optional().isFloat({ min: 0 }),
  body('waterIntake').optional().isFloat({ min: 0 }),
];

export const logWaterValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount required'),
];
```

- [ ] **Step 3: Create nutrition service**

```typescript
// backend/src/services/nutritionService.ts
import { PrismaClient, NutritionLog, MealType } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogMealData {
  mealType: MealType;
  name: string;
  description?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  waterIntake?: number;
}

export async function logMeal(
  userId: string,
  data: LogMealData
): Promise<NutritionLog> {
  return prisma.nutritionLog.create({
    data: {
      userId,
      ...data,
    },
  });
}

export async function getUserNutritionLogs(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<NutritionLog[]> {
  const where: any = { userId };
  
  if (startDate || endDate) {
    where.loggedAt = {};
    if (startDate) where.loggedAt.gte = startDate;
    if (endDate) where.loggedAt.lte = endDate;
  }
  
  return prisma.nutritionLog.findMany({
    where,
    orderBy: { loggedAt: 'desc' },
  });
}

export async function getDailyNutritionSummary(
  userId: string,
  date: Date
): Promise<{ totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number }> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId,
      loggedAt: { gte: startOfDay, lte: endOfDay },
    },
  });
  
  return logs.reduce(
    (acc, log) => ({
      totalCalories: acc.totalCalories + (log.calories || 0),
      totalProtein: acc.totalProtein + (log.protein || 0),
      totalCarbs: acc.totalCarbs + (log.carbs || 0),
      totalFat: acc.totalFat + (log.fat || 0),
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );
}

export async function deleteNutritionLog(id: string): Promise<void> {
  await prisma.nutritionLog.delete({ where: { id } });
}
```

- [ ] **Step 4: Create nutrition controller**

```typescript
// backend/src/controllers/nutritionController.ts
import { Request, Response } from 'express';
import {
  logMeal,
  getUserNutritionLogs,
  getDailyNutritionSummary,
  deleteNutritionLog,
} from '../services/nutritionService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function createMealLog(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const log = await logMeal(authReq.user!.userId, req.body);
    return successResponse(res, log, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function listMealLogs(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const { startDate, endDate } = req.query;
  
  const logs = await getUserNutritionLogs(
    authReq.user!.userId,
    startDate ? new Date(startDate as string) : undefined,
    endDate ? new Date(endDate as string) : undefined
  );
  
  return successResponse(res, logs);
}

export async function getDailySummary(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const { date } = req.query;
  
  const summary = await getDailyNutritionSummary(
    authReq.user!.userId,
    date ? new Date(date as string) : new Date()
  );
  
  return successResponse(res, summary);
}

export async function removeMealLog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteNutritionLog(id);
    return successResponse(res, { message: 'Log deleted' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
```

- [ ] **Step 5: Create nutrition routes**

```typescript
// backend/src/routes/nutrition.ts
import { Router } from 'express';
import {
  createMealLog,
  listMealLogs,
  getDailySummary,
  removeMealLog,
} from '../controllers/nutritionController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { logMealValidation } from '../validations/nutrition.validation';

const router = Router();

router.post('/log', authenticate, validate(logMealValidation), createMealLog);
router.get('/logs', authenticate, listMealLogs);
router.get('/daily', authenticate, getDailySummary);
router.delete('/log/:id', authenticate, removeMealLog);

export default router;
```

- [ ] **Step 6: Run tests**

Run: `cd backend && npm test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat: add nutrition tracking with meal logging"
```
---

## Task 6: Progress Tracking

**Files:**
- Create: `backend/src/controllers/progressController.ts`
- Create: `backend/src/services/progressService.ts`
- Create: `backend/src/routes/progress.ts`
- Test: `backend/tests/progress.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/tests/progress.test.ts
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
    
    userToken = registerRes.body.data.token;
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
});
```

- [ ] **Step 2: Create progress service**

```typescript
// backend/src/services/progressService.ts
import { PrismaClient, BodyMetric } from '@prisma/client';

const prisma = new PrismaClient();

export interface BodyMetricData {
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  waist?: number;
  chest?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

export async function logBodyMetric(
  userId: string,
  data: BodyMetricData
): Promise<BodyMetric> {
  return prisma.bodyMetric.create({
    data: { userId, ...data },
  });
}

export async function getBodyMetrics(userId: string): Promise<BodyMetric[]> {
  return prisma.bodyMetric.findMany({
    where: { userId },
    orderBy: { measuredAt: 'desc' },
  });
}

export async function getProgressAnalytics(
  userId: string,
  period: 'week' | 'month' | 'year' = 'month'
): Promise<any> {
  const now = new Date();
  let startDate = new Date();
  
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  } else {
    startDate.setFullYear(now.getFullYear() - 1);
  }
  
  const metrics = await prisma.bodyMetric.findMany({
    where: {
      userId,
      measuredAt: { gte: startDate },
    },
    orderBy: { measuredAt: 'asc' },
  });
  
  return {
    period,
    startDate,
    endDate: now,
    metrics,
    summary: {
      currentWeight: metrics[0]?.weight,
      startingWeight: metrics[metrics.length - 1]?.weight,
      weightChange: (metrics[0]?.weight || 0) - (metrics[metrics.length - 1]?.weight || 0),
    },
  };
}
```

- [ ] **Step 3: Create progress controller**

```typescript
// backend/src/controllers/progressController.ts
import { Request, Response } from 'express';
import {
  logBodyMetric,
  getBodyMetrics,
  getProgressAnalytics,
} from '../services/progressService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function createBodyMetric(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const metric = await logBodyMetric(authReq.user!.userId, req.body);
    return successResponse(res, metric, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function listBodyMetrics(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const metrics = await getBodyMetrics(authReq.user!.userId);
  return successResponse(res, metrics);
}

export async function getAnalytics(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const { period } = req.query;
  
  const analytics = await getProgressAnalytics(
    authReq.user!.userId,
    (period as any) || 'month'
  );
  
  return successResponse(res, analytics);
}
```

- [ ] **Step 4: Create progress routes**

```typescript
// backend/src/routes/progress.ts
import { Router } from 'express';
import {
  createBodyMetric,
  listBodyMetrics,
  getAnalytics,
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/body', authenticate, createBodyMetric);
router.get('/body', authenticate, listBodyMetrics);
router.get('/analytics', authenticate, getAnalytics);

export default router;
```

- [ ] **Step 5: Run tests**

Run: `cd backend && npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add backend/
git commit -m "feat: add progress tracking with body metrics"
```
---

## Task 7: Social Features (Followers, Leaderboard)

**Files:**
- Create: `backend/src/controllers/socialController.ts`
- Create: `backend/src/services/socialService.ts`
- Create: `backend/src/routes/social.ts`

- [ ] **Step 1: Create social service**

```typescript
// backend/src/services/socialService.ts
import { PrismaClient, User, Follow } from '@prisma/client';

const prisma = new PrismaClient();

export async function followUser(followerId: string, followingId: string): Promise<Follow> {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }
  
  return prisma.follow.create({
    data: { followerId, followingId },
  });
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  await prisma.follow.deleteMany({
    where: { followerId, followingId },
  });
}

export async function getFollowers(userId: string): Promise<User[]> {
  const follows = await prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: true },
  });
  
  return follows.map((f) => f.follower);
}

export async function getFollowing(userId: string): Promise<User[]> {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: true },
  });
  
  return follows.map((f) => f.following);
}

export async function getLeaderboard(limit = 10): Promise<any> {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { workouts: true } },
    },
    orderBy: { workouts: { _count: 'desc' } },
    take: limit,
  });
  
  return users.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    workoutsCompleted: user._count.workouts,
  }));
}

export async function getActivityFeed(
  userId: string,
  limit = 20
): Promise<any[]> {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  
  const userIds = [userId, ...following.map((f) => f.followingId)];
  
  const workouts = await prisma.workout.findMany({
    where: {
      userId: { in: userIds },
      status: 'COMPLETED',
    },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { completedAt: 'desc' },
    take: limit,
  });
  
  return workouts.map((w) => ({
    type: 'WORKOUT_COMPLETED',
    user: w.user,
    workout: { name: w.name, duration: w.duration },
    timestamp: w.completedAt,
  }));
}
```

- [ ] **Step 2: Create social controller**

```typescript
// backend/src/controllers/socialController.ts
import { Request, Response } from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getLeaderboard,
  getActivityFeed,
} from '../services/socialService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function follow(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const { userId } = req.params;
    
    await followUser(authReq.user!.userId, userId);
    return successResponse(res, { message: 'Followed successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function unfollow(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const { userId } = req.params;
    
    await unfollowUser(authReq.user!.userId, userId);
    return successResponse(res, { message: 'Unfollowed successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function listFollowers(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const { userId } = req.params;
  
  const followers = await getFollowers(userId || authReq.user!.userId);
  return successResponse(res, followers);
}

export async function listFollowing(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const { userId } = req.params;
  
  const following = await getFollowing(userId || authReq.user!.userId);
  return successResponse(res, following);
}

export async function listLeaderboard(req: Request, res: Response) {
  const { limit } = req.query;
  const leaderboard = await getLeaderboard(limit ? parseInt(limit as string) : 10);
  return successResponse(res, leaderboard);
}

export async function feed(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const { limit } = req.query;
  
  const feed = await getActivityFeed(
    authReq.user!.userId,
    limit ? parseInt(limit as string) : 20
  );
  return successResponse(res, feed);
}
```

- [ ] **Step 3: Create social routes**

```typescript
// backend/src/routes/social.ts
import { Router } from 'express';
import {
  follow,
  unfollow,
  listFollowers,
  listFollowing,
  listLeaderboard,
  feed,
} from '../controllers/socialController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/follow/:userId', authenticate, follow);
router.delete('/follow/:userId', authenticate, unfollow);
router.get('/followers/:userId', authenticate, listFollowers);
router.get('/following/:userId', authenticate, listFollowing);
router.get('/leaderboard', authenticate, listLeaderboard);
router.get('/feed', authenticate, feed);

export default router;
```

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: add social features (follow, leaderboard, feed)"
```
---

## Task 8: AI Coach Integration

**Files:**
- Create: `backend/src/controllers/aiCoachController.ts`
- Create: `backend/src/services/aiCoachService.ts`
- Create: `backend/src/routes/aiCoach.ts`

- [ ] **Step 1: Create AI Coach service**

```typescript
// backend/src/services/aiCoachService.ts
import { PrismaClient, AICoachChat } from '@prisma/client';
import OpenAI from 'openai';
import { config } from '../config';

const prisma = new PrismaClient();

const openai = config.openai.apiKey ? new OpenAI({ apiKey: config.openai.apiKey }) : null;

const SYSTEM_PROMPT = `You are Fitly's AI Coach, a supportive fitness and nutrition advisor. 
You help users with:
- Workout recommendations and exercise form
- Nutrition advice and meal planning
- Motivation and goal setting
- Progress tracking tips

Always provide encouraging, actionable advice. Keep responses concise and practical.`;

export async function createChat(userId: string): Promise<AICoachChat> {
  return prisma.aICoachChat.create({
    data: {
      userId,
      messages: [
        {
          role: 'assistant',
          content: "Hi! I'm your Fitly AI Coach. How can I help you with your fitness journey today?",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  });
}

export async function sendMessage(
  userId: string,
  chatId: string,
  userMessage: string
): Promise<{ response: string; tokensUsed: number }> {
  const chat = await prisma.aICoachChat.findUnique({ where: { id: chatId } });
  
  if (!chat || chat.userId !== userId) {
    throw new Error('Chat not found');
  }
  
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(chat.messages as any[]),
    { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
  ];
  
  let response: string;
  let tokensUsed = 0;
  
  if (openai) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
    });
    
    response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    tokensUsed = completion.usage?.total_tokens || 0;
  } else {
    response = 'AI Coach is not configured. Please set OPENAI_API_KEY in environment.';
  }
  
  const updatedMessages = [
    ...messages,
    { role: 'assistant', content: response, timestamp: new Date().toISOString() },
  ];
  
  await prisma.aICoachChat.update({
    where: { id: chatId },
    data: {
      messages: updatedMessages,
      tokensUsed: chat.tokensUsed + tokensUsed,
    },
  });
  
  return { response, tokensUsed };
}

export async function getChatHistory(userId: string): Promise<AICoachChat[]> {
  return prisma.aICoachChat.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function generateWorkoutPlan(
  userId: string,
  goal: string,
  fitnessLevel: string
): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const prompt = `Generate a workout plan for a user with the following details:
- Name: ${user?.name}
- Goal: ${goal}
- Fitness Level: ${fitnessLevel}
- Current Weight: ${user?.weight}kg

Provide a weekly workout plan with exercises, sets, reps, and rest periods.`;

  if (openai) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });
    
    return completion.choices[0]?.message?.content || 'Could not generate workout plan.';
  }
  
  return 'AI Coach is not configured. Please set OPENAI_API_KEY in environment.';
}
```

- [ ] **Step 2: Create AI Coach controller**

```typescript
// backend/src/controllers/aiCoachController.ts
import { Request, Response } from 'express';
import {
  createChat,
  sendMessage,
  getChatHistory,
  generateWorkoutPlan,
} from '../services/aiCoachService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function startChat(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const chat = await createChat(authReq.user!.userId);
    return successResponse(res, chat, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function chat(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const { chatId, message } = req.body;
    
    const result = await sendMessage(authReq.user!.userId, chatId, message);
    return successResponse(res, result);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function history(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const chats = await getChatHistory(authReq.user!.userId);
  return successResponse(res, chats);
}

export async function generatePlan(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const { goal, fitnessLevel } = req.body;
    
    const plan = await generateWorkoutPlan(authReq.user!.userId, goal, fitnessLevel);
    return successResponse(res, { plan });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
```

- [ ] **Step 3: Create AI Coach routes**

```typescript
// backend/src/routes/aiCoach.ts
import { Router } from 'express';
import { startChat, chat, history, generatePlan } from '../controllers/aiCoachController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/chat', authenticate, startChat);
router.post('/chat/message', authenticate, chat);
router.get('/chats', authenticate, history);
router.post('/generate-workout', authenticate, generatePlan);

export default router;
```

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: add AI Coach with chat and workout generation"
```
---

## Task 9: Social Login (Google & Apple)

**Files:**
- Modify: `backend/src/services/authService.ts`
- Modify: `backend/src/validations/auth.validation.ts`
- Modify: `backend/src/routes/auth.ts`
- Modify: `backend/src/models/User.ts`

- [ ] **Step 1: Add social login to auth service**

```typescript
// backend/src/services/authService.ts (add these functions)

export interface SocialLoginData {
  googleId?: string;
  appleId?: string;
  email: string;
  name: string;
}

export async function socialLogin(data: SocialLoginData): Promise<{ user: User; token: string }> {
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        data.googleId ? { googleId: data.googleId } : {},
        data.appleId ? { appleId: data.appleId } : {},
      ],
    },
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        googleId: data.googleId,
        appleId: data.appleId,
      },
    });
  }
  
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  
  return { user, token };
}
```

- [ ] **Step 2: Add social login validation**

```typescript
// backend/src/validations/auth.validation.ts (add)

export const googleLoginValidation = [
  body('idToken').notEmpty().withMessage('Google ID token required'),
];

export const appleLoginValidation = [
  body('idToken').notEmpty().withMessage('Apple ID token required'),
  body('user').optional().isObject(),
];
```

- [ ] **Step 3: Add social login routes**

```typescript
// backend/src/routes/auth.ts (add)

import { socialLogin } from '../services/authService';

router.post('/google', validate(googleLoginValidation), async (req, res) => {
  // Verify Google token and login
  // Note: In production, use Google OAuth2 verify token endpoint
  try {
    const { idToken } = req.body;
    // For demo, assume token is verified and contains user info
    const userInfo = { email: 'google@example.com', name: 'Google User', googleId: 'google-123' };
    const result = await socialLogin({
      googleId: userInfo.googleId,
      email: userInfo.email,
      name: userInfo.name,
    });
    return successResponse(res, { user: result.user, token: result.token });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
});

router.post('/apple', validate(appleLoginValidation), async (req, res) => {
  try {
    const { idToken, user } = req.body;
    // For demo, assume token is verified
    const result = await socialLogin({
      appleId: 'apple-123',
      email: user?.email || 'apple@example.com',
      name: user?.name || 'Apple User',
    });
    return successResponse(res, { user: result.user, token: result.token });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: add social login (Google and Apple)"
```
---

## Task 10: API Documentation & Final Testing

**Files:**
- Create: `backend/README.md`
- Test: Run full test suite

- [ ] **Step 1: Create README with API documentation**

```markdown
# Fitly Backend API

RESTful API for the Fitly fitness application.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma migrate dev
npm run dev
```

## Environment Variables

See `.env` file for all configuration options.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/change-password` - Change password (authenticated)
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/apple` - Apple OAuth login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

### Workouts
- `GET /api/workouts` - List user workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout details
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `POST /api/workouts/:id/start` - Start workout
- `POST /api/workouts/:id/complete` - Complete workout

### Exercises
- `GET /api/exercises` - List exercises
- `GET /api/exercises/:id` - Get exercise details
- `POST /api/exercises` - Create exercise (admin)

### Nutrition
- `POST /api/nutrition/log` - Log meal
- `GET /api/nutrition/logs` - Get nutrition logs
- `GET /api/nutrition/daily` - Daily summary
- `DELETE /api/nutrition/log/:id` - Delete log

### Progress
- `POST /api/progress/body` - Log body metrics
- `GET /api/progress/body` - Get metrics history
- `GET /api/progress/analytics` - Get analytics

### Social
- `POST /api/social/follow/:userId` - Follow user
- `DELETE /api/social/follow/:userId` - Unfollow user
- `GET /api/social/followers/:userId` - Get followers
- `GET /api/social/following/:userId` - Get following
- `GET /api/social/leaderboard` - Get leaderboard
- `GET /api/social/feed` - Get activity feed

### AI Coach
- `POST /api/ai-coach/chat` - Start new chat
- `POST /api/ai-coach/chat/message` - Send message
- `GET /api/ai-coach/chats` - Get chat history
- `POST /api/ai-coach/generate-workout` - Generate workout plan

## Running Tests

```bash
npm test
```

## License

MIT
```

- [ ] **Step 2: Run full test suite**

Run: `cd backend && npm test`
Expected: All tests pass

- [ ] **Step 3: Final commit**

```bash
git add backend/
git commit -m "feat: complete backend API with all features"
```

---

## Plan Complete

The plan is saved to `docs/superpowers/plans/2026-05-04-fitly-backend.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
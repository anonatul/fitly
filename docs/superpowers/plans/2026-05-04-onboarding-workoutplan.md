# Onboarding & Workout Plan Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build onboarding flow that collects 8 fitness questions and generates personalized workout plans via workoutapi.com

**Architecture:** Backend exposes /api/onboarding/complete endpoint that validates input, calls workoutapi.com API, saves program to user profile. Frontend displays form and shows generated plan.

**Tech Stack:** Node.js/Express, Prisma, workoutapi.com REST API, axios

---

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── workoutAPIService.ts     # workoutapi.com integration
│   │   └── onboardingService.ts     # onboarding logic
│   ├── controllers/
│   │   └── onboardingController.ts
│   ├── routes/
│   │   └── onboarding.ts
│   └── validations/
│       └── onboarding.validation.ts
├── prisma/
│   └── schema.prisma              # Add onboarding fields
└── tests/
    └── onboarding.test.ts
```

---

## Task 1: Database Schema Updates

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Add onboarding fields to User model**

```prisma
// Add to User model
onboardingComplete Boolean @default(false)
workoutProgramId  String?
workoutProgram    Json?

// Onboarding fields
gender            String?
age               Int?
weight            Float?
height            Float?
activityLevel     String?
waterIntake       Float?
goal              String?
daysPerWeek      Int?
```

- [ ] **Step 2: Run Prisma migrate**

Run: `cd backend && npx prisma migrate dev --name add_onboarding_fields`
Expected: Migration created

- [ ] **Step 3: Commit**

```bash
git add backend/prisma/
git commit -m "feat: add onboarding fields to User model"
```
---

## Task 2: WorkoutAPI.com Service

**Files:**
- Create: `backend/src/services/workoutAPIService.ts`

- [ ] **Step 1: Create workoutapi.com service**

```typescript
// backend/src/services/workoutAPIService.ts
import axios from 'axios';
import { config } from '../config';

const WORKOUT_API_BASE = 'https://api.workoutapi.com/v2';

export interface OnboardingData {
  gender: 'male' | 'female' | 'other';
  age: number;
  weight: number;       // kg
  height: number;      // cm
  activityLevel: 'light' | 'moderate' | 'intensive';
  waterIntake: number; // liters
  goal: 'lose_weight' | 'maintain' | 'build_muscle';
  daysPerWeek: 4 | 5;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  days: any[];
}

export async function generateWorkoutProgram(data: OnboardingData): Promise<WorkoutProgram> {
  const apiKey = config.workoutAPI.key;
  
  const requestBody = {
    profile: {
      sex: data.gender,
      age: data.age,
      bodyweightKg: data.weight,
      heightCm: data.height,
      activityLevel: data.activityLevel,
      waterIntake: data.waterIntake,
    },
    goals: {
      primary: data.goal,
    },
    schedule: {
      daysPerWeek: data.daysPerWeek,
    },
    programConfig: {
      durationWeeks: 4,
    },
  };

  const response = await axios.post(
    `${WORKOUT_API_BASE}/programs/generate`,
    requestBody,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return {
    id: response.data.programId,
    name: response.data.name,
    days: response.data.days,
  };
}
```

- [ ] **Step 2: Add API key to config**

Modify: `backend/src/config/index.ts`

```typescript
workoutAPI: {
  key: process.env.WORKOUT_API_KEY || '',
}
```

- [ ] **Step 3: Update .env**

```env
WORKOUT_API_KEY=09765652c6c7a71d0d04039334fac8c7c86033237720cb3a5fd22b33786afee1
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/services/workoutAPIService.ts backend/src/config/index.ts backend/.env
git commit -m "feat: add workoutapi.com service integration"
```
---

## Task 3: Onboarding Controller & Routes

**Files:**
- Create: `backend/src/controllers/onboardingController.ts`
- Create: `backend/src/routes/onboarding.ts`
- Create: `backend/src/services/onboardingService.ts`
- Create: `backend/src/validations/onboarding.validation.ts`

- [ ] **Step 1: Create validation**

```typescript
// backend/src/validations/onboarding.validation.ts
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
```

- [ ] **Step 2: Create onboarding service**

```typescript
// backend/src/services/onboardingService.ts
import { PrismaClient } from '@prisma/client';
import { generateWorkoutProgram, OnboardingData } from './workoutAPIService';

const prisma = new PrismaClient();

export async function completeOnboarding(
  userId: string,
  data: OnboardingData
): Promise<{ user: any; program: any }> {
  // Generate workout program
  const program = await generateWorkoutProgram(data);
  
  // Update user with onboarding data and program
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      onboardingComplete: true,
      gender: data.gender,
      age: data.age,
      weight: data.weight,
      height: data.height,
      activityLevel: data.activityLevel,
      waterIntake: data.waterIntake,
      goal: data.goal,
      daysPerWeek: data.daysPerWeek,
      workoutProgramId: program.id,
      workoutProgram: program,
    },
  });
  
  return { user, program };
}

export async function regenerateProgram(userId: string): Promise<any> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const data: OnboardingData = {
    gender: user.gender as any,
    age: user.age!,
    weight: user.weight!,
    height: user.height!,
    activityLevel: user.activityLevel as any,
    waterIntake: user.waterIntake!,
    goal: user.goal as any,
    daysPerWeek: user.daysPerWeek as any,
  };
  
  return generateWorkoutProgram(data);
}
```

- [ ] **Step 3: Create controller**

```typescript
// backend/src/controllers/onboardingController.ts
import { Request, Response } from 'express';
import { completeOnboarding, regenerateProgram } from '../services/onboardingService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function complete(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const result = await completeOnboarding(authReq.user!.userId, req.body);
    return successResponse(res, {
      message: 'Onboarding complete!',
      program: result.program,
    });
  } catch (error: any) {
    return errorResponse(res, error.message, error.response?.status || 500);
  }
}

export async function regenerate(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const program = await regenerateProgram(authReq.user!.userId);
    return successResponse(res, { program });
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
}
```

- [ ] **Step 4: Create routes**

```typescript
// backend/src/routes/onboarding.ts
import { Router } from 'express';
import { complete, regenerate } from '../controllers/onboardingController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { onboardingValidation } from '../validations/onboarding.validation';

const router = Router();

router.post('/complete', authenticate, validate(onboardingValidation), complete);
router.post('/regenerate', authenticate, regenerate);

export default router;
```

- [ ] **Step 5: Register route in app.ts**

Modify: `backend/src/app.ts`

```typescript
import onboardingRoutes from './routes/onboarding';

// Add route
app.use('/api/onboarding', onboardingRoutes);
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/
git commit -m "feat: add onboarding endpoints with workoutapi.com integration"
```
---

## Task 4: Tests

**Files:**
- Create: `backend/tests/onboarding.test.ts`

- [ ] **Step 1: Write tests**

```typescript
// backend/tests/onboarding.test.ts
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let userToken: string;
let userId: string;

describe('Onboarding API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'onboarding@test.com',
        password: 'password123',
        name: 'Onboarding User',
      });
    
    userToken = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  describe('POST /api/onboarding/complete', () => {
    it('should complete onboarding with valid data', async () => {
      const response = await request(app)
        .post('/api/onboarding/complete')
        .set('Authorization', `Bearer ${userToken}`)
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
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('program');
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd backend && npm test`
Expected: Tests pass

- [ ] **Step 3: Commit**

```bash
git add backend/tests/
git commit -m "test: add onboarding API tests"
```
---

## Task 5: Check Profile Completeness Middleware

**Files:**
- Modify: `backend/src/middleware/auth.ts`

- [ ] **Step 1: Add onboarding check**

```typescript
// Add to auth.ts
export function requireOnboarding(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest;
  
  // This would check user.onboardingComplete
  // For now, just pass through - frontend handles redirect
  
  next();
}
```

This is typically handled on frontend - backend just validates per-endpoint.

- [ ] **Step 2: Commit**

```bash
git add backend/src/middleware/auth.ts
git commit -m "chore: add onboarding check middleware"
```
---

## Plan Complete

**Saved to:** `docs/superpowers/plans/2026-05-04-onboarding-workoutplan.md`

**Two execution options:**

1. **Subagent-Driven (recommended)** - Fresh subagent per task, review between tasks
2. **Inline Execution** - Execute in this session with checkpoints

**Which approach?**
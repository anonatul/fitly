# Onboarding & Workout Plan Generation - Design

## Overview
Build an onboarding flow that collects user fitness profile via 8 questions, then generates personalized workout plans using workoutapi.com API.

## User Flow
1. User logs in → Backend checks if `onboardingComplete = false`
2. If incomplete → Frontend displays 8-question form
3. On submit → Backend calls workoutapi.com API
4. API returns workout plan → Saved to user profile
5. User is redirected to their personalized workout plan

## Trigger Logic
```typescript
// On any authenticated API call
const user = await getUser(userId);
if (!user.onboardingComplete) {
  return { redirect: '/onboarding', reason: 'profile_incomplete' };
}
```

## API Endpoints

### Backend: POST /api/onboarding/complete
**Input:**
```json
{
  "gender": "male" | "female" | "other",
  "age": number,
  "weight": number,        // in kg
  "height": number,        // in cm
  "activityLevel": "light" | "moderate" | "intensive",
  "waterIntake": number,    // in liters
  "goal": "lose_weight" | "maintain" | "build_muscle",
  "daysPerWeek": 4 | 5
}
```

**Process:**
1. Validate all fields
2. Update user profile in database
3. Call workoutapi.com `/programs/generate`
4. Save returned program to user profile
5. Mark `onboardingComplete = true`
6. Return generated workout plan

**Response:**
```json
{
  "success": true,
  "program": { ... },  // workoutapi.com response
  "message": "Onboarding complete!"
}
```

### Frontend: GET /onboarding
- Show 8-question form
- On submit → POST /api/onboarding/complete

### Frontend: GET /workouts
- If onboarding incomplete → redirect to /onboarding
- Otherwise → show user's workout plan

## Question Mapping

| # | Question | API Field | Type |
|---|----------|----------|------|
| 1 | Gender | `sex` | select: male/female/other |
| 2 | Age | `age` | number |
| 3 | Weight (kg) | `bodyweightKg` | number |
| 4 | Height (cm) | `heightCm` | number |
| 5 | Activity level | `profile.activityLevel` | select: light/moderate/intensive |
| 6 | Water intake (L) | `profile.waterIntake` | number |
| 7 | Primary goal | `goals.primary` | select: lose_weight/maintain/build_muscle |
| 8 | Days per week | `schedule.daysPerWeek` | select: 4/5 |

## Database Changes

### User Model - Add Fields
```prisma
model User {
  // ... existing fields
  onboardingComplete Boolean @default(false)
  workoutProgramId  String?  // workoutapi.com program ID
  workoutProgram    Json?     // saved program data
  
  // Onboarding fields
  gender            String?
  age               Int?
  weight            Float?
  height            Float?
  activityLevel     String?
  waterIntake       Float?
  goal              String?
  daysPerWeek      Int?
}
```

## WorkoutAPI.com Integration

### API Key
```
Authorization: Bearer 09765652c6c7a71d0d04039334fac8c7c86033237720cb3a5fd22b33786afee1
```

### Endpoint
```
POST https://api.workoutapi.com/v2/programs/generate
```

### Request Body
```json
{
  "profile": {
    "sex": "male",
    "age": 25,
    "bodyweightKg": 75,
    "heightCm": 180,
    "activityLevel": "moderate",
    "waterIntake": 2.5
  },
  "goals": {
    "primary": "build_muscle"
  },
  "schedule": {
    "daysPerWeek": 5
  },
  "programConfig": {
    "durationWeeks": 4
  }
}
```

### Response Handling
- Store `programId` for future reference
- Store full program JSON for quick display
- Allow regeneration on demand

## Error Handling
| Scenario | Response |
|----------|----------|
| Invalid form data | 400 with validation errors |
| workoutapi.com API error | 502 with API error message |
| Network failure | 503 with retry suggestion |
| User not authenticated | 401 Unauthorized |

## Saved Programs
- User can regenerate plan with new parameters
- Keep history of last 3 generated programs
- Allow user to view previous plans

## Acceptance Criteria
1. [ ] Incomplete profile redirects to /onboarding
2. [ ] All 8 questions displayed and validated
3. [ ] workoutapi.com called with correct params
4. [ ] Program saved to user profile
5. [ ] User can view generated plan
6. [ ] User can regenerate plan
7. [ ] Tests pass for all new endpoints
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

### Nutrition
- `POST /api/nutrition/log` - Log meal
- `GET /api/nutrition/logs` - Get nutrition logs
- `GET /api/nutrition/daily` - Daily summary
- `DELETE /api/nutrition/log/:id` - Delete log

### Progress
- `POST /api/progress/body` - Log body metrics
- `GET /api/progress/body` - Get metrics history
- `GET /api/progress/analytics` - Get analytics

### AI Coach
- `POST /api/ai-coach/chat` - Chat with AI coach
- `POST /api/ai-coach/generate-workout` - Generate workout plan
- `POST /api/ai-coach/analyze-form` - Analyze exercise form

### Social
- `GET /api/social/feed` - Get activity feed
- `POST /api/social/follow/:userId` - Follow user
- `DELETE /api/social/follow/:userId` - Unfollow user

## Running Tests

```bash
npm test
```

## License

MIT
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import workoutRoutes from './routes/workouts';
import exerciseRoutes from './routes/exercises';
import nutritionRoutes from './routes/nutrition';
import progressRoutes from './routes/progress';
import socialRoutes from './routes/social';
import onboardingRoutes from './routes/onboarding';
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
app.use('/api/onboarding', onboardingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;
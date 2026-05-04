import express from 'express';
import cors from 'cors';
import onboardingRoutes from './routes/onboarding';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/onboarding', onboardingRoutes);

export default app;
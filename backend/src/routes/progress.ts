import { Router } from 'express';
import { createBodyMetric, listBodyMetrics, getAnalytics } from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/body', authenticate, createBodyMetric);
router.get('/body', authenticate, listBodyMetrics);
router.get('/analytics', authenticate, getAnalytics);

export default router;
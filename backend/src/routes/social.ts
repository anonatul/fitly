import { Router } from 'express';
import { follow, unfollow, listLeaderboard, feed } from '../controllers/socialController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/follow/:userId', authenticate, follow);
router.delete('/follow/:userId', authenticate, unfollow);
router.get('/leaderboard', authenticate, listLeaderboard);
router.get('/feed', authenticate, feed);

export default router;
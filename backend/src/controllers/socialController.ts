import { Request, Response } from 'express';
import { followUser, unfollowUser, getLeaderboard, getActivityFeed } from '../services/socialService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function follow(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    await followUser(authReq.user!.userId, req.params.userId);
    return successResponse(res, { message: 'Followed' });
  } catch (e: any) { return errorResponse(res, e.message, 400); }
}

export async function unfollow(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    await unfollowUser(authReq.user!.userId, req.params.userId);
    return successResponse(res, { message: 'Unfollowed' });
  } catch (e: any) { return errorResponse(res, e.message, 400); }
}

export async function listLeaderboard(req: Request, res: Response) {
  const leaderboard = await getLeaderboard(10);
  return successResponse(res, leaderboard);
}

export async function feed(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const feedData = await getActivityFeed(authReq.user!.userId);
  return successResponse(res, feedData);
}
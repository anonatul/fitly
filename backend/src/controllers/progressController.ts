import { Request, Response } from 'express';
import { logBodyMetric, getBodyMetrics, getProgressAnalytics } from '../services/progressService';
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
  const analytics = await getProgressAnalytics(authReq.user!.userId);
  return successResponse(res, analytics);
}
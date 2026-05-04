import { Request, Response } from 'express';
import { logMeal, getUserNutritionLogs, getDailyNutritionSummary, deleteNutritionLog } from '../services/nutritionService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function createMealLog(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const logEntry = await logMeal(authReq.user!.userId, req.body);
    return successResponse(res, logEntry, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function listMealLogs(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const logs = await getUserNutritionLogs(authReq.user!.userId);
  return successResponse(res, logs);
}

export async function getDailySummary(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const summary = await getDailyNutritionSummary(authReq.user!.userId);
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
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
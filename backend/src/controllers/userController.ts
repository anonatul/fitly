import { Request, Response } from 'express';
import { getUserProfile, updateUserProfile, deleteUser } from '../services/userService';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function getProfile(req: Request, res: Response) {
  try {
    const authReq = req as unknown as AuthRequest;
    const user = await getUserProfile(authReq.user!.userId);
    return successResponse(res, user);
  } catch (error: any) {
    return errorResponse(res, error.message, 404);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const authReq = req as unknown as AuthRequest;
    const user = await updateUserProfile(authReq.user!.userId, req.body);
    return successResponse(res, user);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function deleteProfile(req: Request, res: Response) {
  try {
    const authReq = req as unknown as AuthRequest;
    await deleteUser(authReq.user!.userId);
    return successResponse(res, { message: 'Profile deleted' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
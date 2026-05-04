import { Request, Response } from 'express';
import {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  startWorkout,
  completeWorkout,
} from '../services/workoutService';
import { successResponse, errorResponse, notFoundResponse } from '../utils/responses';
import { AuthRequest } from '../middleware/auth';

export async function listWorkouts(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const workouts = await getUserWorkouts(authReq.user!.userId);
  return successResponse(res, workouts);
}

export async function getWorkout(req: Request, res: Response) {
  const { id } = req.params;
  const workout = await getWorkoutById(id);
  
  if (!workout) {
    return notFoundResponse(res, 'Workout not found');
  }
  
  return successResponse(res, workout);
}

export async function createNewWorkout(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const workout = await createWorkout(authReq.user!.userId, req.body);
    return successResponse(res, workout, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function updateExistingWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const workout = await updateWorkout(id, req.body);
    return successResponse(res, workout);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function removeWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteWorkout(id);
    return successResponse(res, { message: 'Workout deleted' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function startExistingWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const workout = await startWorkout(id);
    return successResponse(res, workout);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}

export async function finishWorkout(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const workout = await completeWorkout(id);
    return successResponse(res, workout);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
}
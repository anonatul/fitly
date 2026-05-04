import { Request, Response } from 'express';
import { getAllExercises, getExerciseById } from '../services/exerciseService';
import { successResponse, notFoundResponse } from '../utils/responses';

export async function listExercises(req: Request, res: Response) {
  const { muscleGroup } = req.query;
  const exercises = await getAllExercises(muscleGroup as string);
  return successResponse(res, exercises);
}

export async function getExercise(req: Request, res: Response) {
  const { id } = req.params;
  const exercise = await getExerciseById(id);
  
  if (!exercise) {
    return notFoundResponse(res, 'Exercise not found');
  }
  
  return successResponse(res, exercise);
}
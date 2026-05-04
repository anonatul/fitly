import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { successResponse, errorResponse, createdResponse } from '../utils/responses';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const { user, token } = await registerUser({ email, password, name });
    return createdResponse(res, { user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (e: any) { return errorResponse(res, e.message, 400); }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });
    return successResponse(res, { user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (e: any) { return errorResponse(res, e.message, 401); }
}
import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function successResponse<T>(res: Response, data: T, statusCode = 200): Response {
  return res.status(statusCode).json({ success: true, data });
}

export function errorResponse(res: Response, message: string, statusCode = 400): Response {
  return res.status(statusCode).json({ success: false, error: message });
}

export function createdResponse<T>(res: Response, data: T): Response {
  return successResponse(res, data, 201);
}

export function unauthorizedResponse(res: Response, message = 'Unauthorized'): Response {
  return errorResponse(res, message, 401);
}

export function notFoundResponse(res: Response, message = 'Not found'): Response {
  return errorResponse(res, message, 404);
}
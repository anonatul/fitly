import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { unauthorizedResponse } from '../utils/responses';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorizedResponse(res, 'No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = verifyToken(token);
    (req as AuthRequest).user = payload;
    next();
  } catch (error) {
    return unauthorizedResponse(res, 'Invalid token');
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return unauthorizedResponse(res);
    }
    
    if (!roles.includes(authReq.user.role)) {
      return forbiddenResponse(res, 'Insufficient permissions');
    }
    
    next();
  };
}

function forbiddenResponse(res: Response, message: string = 'Forbidden') {
  return res.status(403).json({
    success: false,
    error: message,
  });
}
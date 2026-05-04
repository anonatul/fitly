import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface JWTPayload { userId: string; email: string; role: string; }

export function generateToken(payload: JWTPayload): string {
  const options: SignOptions = { expiresIn: '7d' as any };
  return jwt.sign(payload, config.jwt.secret, options);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
}
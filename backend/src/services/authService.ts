import { PrismaClient, User } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken, JWTPayload } from '../utils/jwt';

const prisma = new PrismaClient();

export interface RegisterData { email: string; password: string; name: string; }
export interface LoginData { email: string; password: string; }

export async function registerUser(data: RegisterData): Promise<{ user: User; token: string }> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already registered');
  
  const user = await prisma.user.create({
    data: { email: data.email, password: await hashPassword(data.password), name: data.name },
  });
  
  return { user, token: generateToken({ userId: user.id, email: user.email, role: user.role }) };
}

export async function loginUser(data: LoginData): Promise<{ user: User; token: string }> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.password) throw new Error('Invalid credentials');
  
  const isValid = await verifyPassword(data.password, user.password);
  if (!isValid) throw new Error('Invalid credentials');
  
  return { user, token: generateToken({ userId: user.id, email: user.email, role: user.role }) };
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
import { PrismaClient, User, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export interface UpdateProfileData {
  name?: string;
  height?: number;
  weight?: number;
  goalWeight?: number;
  gender?: string;
  dateOfBirth?: Date;
  bio?: string;
  avatarUrl?: string;
}

export async function getUserProfile(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileData
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      height: data.height,
      weight: data.weight,
      goalWeight: data.goalWeight,
      gender: data.gender as any,
      dateOfBirth: data.dateOfBirth,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    },
  });
}

export async function deleteUser(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}
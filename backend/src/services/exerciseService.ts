import { PrismaClient, Exercise } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllExercises(muscleGroup?: string): Promise<Exercise[]> {
  const where = muscleGroup ? { muscleGroup } : {};
  return prisma.exercise.findMany({ where });
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  return prisma.exercise.findUnique({ where: { id } });
}
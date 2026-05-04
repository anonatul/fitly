import { PrismaClient, NutritionLog, MealType } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogMealData {
  mealType: MealType;
  name: string;
  description?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export async function logMeal(userId: string, data: LogMealData): Promise<NutritionLog> {
  return prisma.nutritionLog.create({
    data: { userId, ...data },
  });
}

export async function getUserNutritionLogs(userId: string): Promise<NutritionLog[]> {
  return prisma.nutritionLog.findMany({
    where: { userId },
    orderBy: { loggedAt: 'desc' },
  });
}

export async function getDailyNutritionSummary(userId: string): Promise<{ totalCalories: number; totalProtein: number }> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const logs = await prisma.nutritionLog.findMany({
    where: { userId, loggedAt: { gte: startOfDay, lte: endOfDay } },
  });
  
  return logs.reduce(
    (acc, log) => ({
      totalCalories: acc.totalCalories + (log.calories || 0),
      totalProtein: acc.totalProtein + (log.protein || 0),
    }),
    { totalCalories: 0, totalProtein: 0 }
  );
}

export async function deleteNutritionLog(id: string): Promise<void> {
  await prisma.nutritionLog.delete({ where: { id } });
}
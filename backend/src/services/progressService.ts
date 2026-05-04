import { PrismaClient, BodyMetric } from '@prisma/client';

const prisma = new PrismaClient();

export interface BodyMetricData {
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
}

export async function logBodyMetric(userId: string, data: BodyMetricData): Promise<BodyMetric> {
  return prisma.bodyMetric.create({ data: { userId, ...data } });
}

export async function getBodyMetrics(userId: string): Promise<BodyMetric[]> {
  return prisma.bodyMetric.findMany({ where: { userId }, orderBy: { measuredAt: 'desc' } });
}

export async function getProgressAnalytics(userId: string): Promise<any> {
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - 1);
  
  const metrics = await prisma.bodyMetric.findMany({
    where: { userId, measuredAt: { gte: startDate } },
    orderBy: { measuredAt: 'asc' },
  });
  
  return { period: 'month', metrics, count: metrics.length };
}
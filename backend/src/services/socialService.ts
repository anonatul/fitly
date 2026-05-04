import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) throw new Error('Cannot follow yourself');
  return prisma.follow.create({ data: { followerId, followingId } });
}

export async function unfollowUser(followerId: string, followingId: string) {
  await prisma.follow.deleteMany({ where: { followerId, followingId } });
}

export async function getLeaderboard(limit = 10) {
  const users = await prisma.user.findMany({
    include: { _count: { select: { workouts: true } } },
    orderBy: { workouts: { _count: 'desc' } },
    take: limit,
  });
  return users.map((u, i) => ({ rank: i + 1, name: u.name, workouts: u._count.workouts }));
}

export async function getActivityFeed(userId: string, limit = 20) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const userIds = [userId, ...following.map(f => f.followingId)];
  
  return prisma.workout.findMany({
    where: { userId: { in: userIds }, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    take: limit,
  });
}
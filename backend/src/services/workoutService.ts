import { PrismaClient, Workout, WorkoutStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateWorkoutData {
  name: string;
  description?: string;
  scheduledAt?: Date;
  exercises?: {
    exerciseId: string;
    sets: number;
    reps?: number;
    duration?: number;
    weight?: number;
    restTime?: number;
  }[];
}

export interface UpdateWorkoutData {
  name?: string;
  description?: string;
  status?: WorkoutStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export async function createWorkout(userId: string, data: CreateWorkoutData): Promise<Workout> {
  const { exercises, ...workoutData } = data;
  
  const workout = await prisma.workout.create({
    data: {
      userId,
      ...workoutData,
      scheduledAt: workoutData.scheduledAt,
    },
  });
  
  if (exercises && exercises.length > 0) {
    await prisma.workoutExercise.createMany({
      data: exercises.map((ex, index) => ({
        workoutId: workout.id,
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        weight: ex.weight,
        restTime: ex.restTime,
        order: index,
      })),
    });
  }
  
  return getWorkoutById(workout.id) as Promise<Workout>;
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  return prisma.workout.findUnique({
    where: { id },
    include: { exercises: { include: { exercise: true } } },
  });
}

export async function getUserWorkouts(userId: string): Promise<Workout[]> {
  return prisma.workout.findMany({
    where: { userId },
    include: { exercises: { include: { exercise: true } } },
    orderBy: { scheduledAt: 'desc' },
  });
}

export async function updateWorkout(id: string, data: UpdateWorkoutData): Promise<Workout> {
  return prisma.workout.update({
    where: { id },
    data,
    include: { exercises: { include: { exercise: true } } },
  });
}

export async function deleteWorkout(id: string): Promise<void> {
  await prisma.workout.delete({ where: { id } });
}

export async function startWorkout(id: string): Promise<Workout> {
  return prisma.workout.update({
    where: { id },
    data: { status: 'IN_PROGRESS', startedAt: new Date() },
    include: { exercises: { include: { exercise: true } } },
  });
}

export async function completeWorkout(id: string): Promise<Workout> {
  const workout = await prisma.workout.findUnique({ where: { id } });
  
  if (!workout?.startedAt) {
    throw new Error('Workout has not been started');
  }
  
  const duration = Math.round(
    (new Date().getTime() - workout.startedAt.getTime()) / 60000
  );
  
  return prisma.workout.update({
    where: { id },
    data: { status: 'COMPLETED', completedAt: new Date(), duration },
    include: { exercises: { include: { exercise: true } } },
  });
}
import { PrismaClient } from '@prisma/client';
import { generateWorkoutProgram, OnboardingData } from './workoutAPIService';

const prisma = new PrismaClient();

export async function completeOnboarding(
  userId: string,
  data: OnboardingData
): Promise<{ user: any; program: any }> {
  const program = await generateWorkoutProgram(data);
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      onboardingComplete: true,
      gender: data.gender as any,
      age: data.age,
      weight: data.weight,
      height: data.height,
      activityLevel: data.activityLevel,
      waterIntake: data.waterIntake,
      goal: data.goal,
      daysPerWeek: data.daysPerWeek,
      workoutProgramId: program.id,
      workoutProgram: program as any,
    },
  });
  
  return { user, program };
}

export async function regenerateProgram(userId: string): Promise<any> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (!user.age || !user.weight || !user.height) {
    throw new Error('User profile incomplete. Please complete onboarding first.');
  }
  
  const data: OnboardingData = {
    gender: (user.gender as any) || 'other',
    age: user.age!,
    weight: user.weight!,
    height: user.height!,
    activityLevel: (user.activityLevel as any) || 'moderate',
    waterIntake: user.waterIntake || 2,
    goal: (user.goal as any) || 'maintain',
    daysPerWeek: (user.daysPerWeek as any) || 4,
  };
  
  return generateWorkoutProgram(data);
}
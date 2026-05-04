import axios from 'axios';
import { config } from '../config';

const WORKOUT_API_BASE = 'https://api.workoutapi.com/v2';

export interface OnboardingData {
  gender: 'male' | 'female' | 'other';
  age: number;
  weight: number;       // kg
  height: number;      // cm
  activityLevel: 'light' | 'moderate' | 'intensive';
  waterIntake: number; // liters
  goal: 'lose_weight' | 'maintain' | 'build_muscle';
  daysPerWeek: 4 | 5;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  days: any[];
}

export async function generateWorkoutProgram(data: OnboardingData): Promise<WorkoutProgram> {
  const apiKey = config.workoutAPI.key;
  
  const requestBody = {
    profile: {
      sex: data.gender,
      age: data.age,
      bodyweightKg: data.weight,
      heightCm: data.height,
      activityLevel: data.activityLevel,
      waterIntake: data.waterIntake,
    },
    goals: {
      primary: data.goal,
    },
    schedule: {
      daysPerWeek: data.daysPerWeek,
    },
    programConfig: {
      durationWeeks: 4,
    },
  };

  const response = await axios.post(
    `${WORKOUT_API_BASE}/programs/generate`,
    requestBody,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return {
    id: response.data.programId,
    name: response.data.name,
    days: response.data.days,
  };
}
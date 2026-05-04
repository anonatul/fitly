import dotenv from 'dotenv';

dotenv.config();

export const config = {
  workoutAPI: {
    key: process.env.WORKOUT_API_KEY || '',
  },
};
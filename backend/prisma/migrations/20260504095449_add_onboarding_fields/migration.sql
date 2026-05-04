-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activityLevel" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "daysPerWeek" INTEGER,
ADD COLUMN     "goal" TEXT,
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "waterIntake" DOUBLE PRECISION,
ADD COLUMN     "workoutProgram" JSONB,
ADD COLUMN     "workoutProgramId" TEXT;

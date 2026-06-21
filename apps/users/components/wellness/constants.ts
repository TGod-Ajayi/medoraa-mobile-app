import { diabetes, energy, getFit, habit, hypertension, weight } from '@/config/svg';
import {
  habitAlcohol,
  habitEating,
  habitExercise,
  habitSleep,
  habitSoda,
  habitSteps,
  habitStress,
  habitWater,
  interestAiCoaching,
  interestCommunity,
  interestHomeWorkouts,
  interestMental,
  interestNutrition,
  interestWeightLoss,
} from '@/config/wellness-icons';
import type { AppTheme } from '../../config/theme';

export type WellnessTheme = {
  background: string;
  card: string;
  cardBorder: string;
  cardSelectedBorder: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  stepTrack: string;
  summaryBorder: string;
  summaryBg: string;
};

export function getWellnessTheme(theme: AppTheme): WellnessTheme {
  return {
    background: theme.background,
    card: theme.card,
    cardBorder: theme.divider,
    cardSelectedBorder: theme.accent,
    accent: theme.accent,
    textPrimary: theme.textPrimary,
    textSecondary: theme.textSecondary,
    stepTrack: theme.surfaceMuted,
    summaryBorder: theme.accent,
    summaryBg: theme.promoBannerBg,
  };
}

export const TOTAL_STEPS = 4;

export type WellnessGoal = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type WellnessHabit = {
  id: string;
  icon: string;
  title: string;
};

export type WellnessInterest = {
  id: string;
  icon: string;
  title: string;
};

export const WELLNESS_GOALS: WellnessGoal[] = [
  {
    id: 'lose-weight',
    icon: weight,
    title: 'Lose Weight',
    description: 'Shed excess weight sustainably',
  },
  {
    id: 'get-fit',
    icon: getFit,
    title: 'Get Fit',
    description: 'Build stamina and strength',
  },
  {
    id: 'hypertension',
    icon: hypertension,
    title: 'Manage Hypertension',
    description: 'Lower blood pressure naturally',
  },
  {
    id: 'diabetes',
    icon: diabetes,
    title: 'Manage Diabetes',
    description: 'Control blood sugar levels',
  },
  {
    id: 'habits',
    icon: habit,
    title: 'Build Better Habits',
    description: 'Create lasting lifestyle changes',
  },
  {
    id: 'energy',
    icon: energy,
    title: 'Boost Energy',
    description: 'Feel vibrant everyday',
  },
];

export const WELLNESS_HABITS: WellnessHabit[] = [
  { id: 'sleep', icon: habitSleep, title: 'Better Sleep' },
  { id: 'water', icon: habitWater, title: 'Drink More Water' },
  { id: 'steps', icon: habitSteps, title: 'Daily Steps' },
  { id: 'eating', icon: habitEating, title: 'Healthy Eating' },
  { id: 'stress', icon: habitStress, title: 'Reduce Stress' },
  { id: 'alcohol', icon: habitAlcohol, title: 'No Alcohol' },
  { id: 'soda', icon: habitSoda, title: 'Cut Out Soda' },
  { id: 'exercise', icon: habitExercise, title: 'Daily Exercise' },
];

export const WELLNESS_INTERESTS: WellnessInterest[] = [
  { id: 'nutrition', icon: interestNutrition, title: 'African Nutrition' },
  { id: 'home-workouts', icon: interestHomeWorkouts, title: 'Home Workouts' },
  { id: 'mental', icon: interestMental, title: 'Mental Wellness' },
  { id: 'weight-loss', icon: interestWeightLoss, title: 'Weight Loss' },
  { id: 'community', icon: interestCommunity, title: 'Community' },
  { id: 'ai-coaching', icon: interestAiCoaching, title: 'AI Coaching' },
];

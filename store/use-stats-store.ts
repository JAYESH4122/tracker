import { create } from "zustand";

import { useExerciseStore } from "@/store/use-exercise-store";
import { useHistoryStore } from "@/store/use-history-store";
import type { PersonalRecord, Workout } from "@/types/workout";
import { computeWorkoutVolume, getExerciseLatestPR, isWithinCurrentWeek } from "@/utils/workout";

type StatsStore = {
  computeVolume: (workouts?: Workout[]) => number;
  computePRs: (workouts?: Workout[]) => PersonalRecord[];
  getSummary: () => {
    totalWorkouts: number;
    weeklyWorkouts: number;
    totalVolume: number;
  };
};

export const useStatsStore = create<StatsStore>(() => ({
  computeVolume: (workouts = useHistoryStore.getState().workouts) =>
    workouts.reduce((sum, workout) => sum + computeWorkoutVolume(workout), 0),

  computePRs: (workouts = useHistoryStore.getState().workouts) => {
    const exercises = useExerciseStore.getState().exerciseList;

    return exercises
      .map((exercise) => getExerciseLatestPR(workouts, exercise.id))
      .filter((record): record is PersonalRecord => record !== null)
      .sort((a, b) => b.maxWeight - a.maxWeight);
  },

  getSummary: () => {
    const workouts = useHistoryStore.getState().workouts;

    return {
      totalWorkouts: workouts.length,
      weeklyWorkouts: workouts.filter((workout) => isWithinCurrentWeek(workout.date)).length,
      totalVolume: workouts.reduce((sum, workout) => sum + computeWorkoutVolume(workout), 0),
    };
  },
}));

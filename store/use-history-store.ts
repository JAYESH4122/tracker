import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { INITIAL_SEED_WORKOUTS } from "@/data/seed-workouts";
import type { Workout } from "@/types/workout";
import { groupWorkoutsByDate } from "@/utils/workout";

type HistoryStore = {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  getWorkoutById: (workoutId: string) => Workout | undefined;
  getWorkoutByDate: (date: string) => Workout[];
  groupedWorkouts: () => ReturnType<typeof groupWorkoutsByDate>;
  clearHistory: () => void;
};

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      workouts: INITIAL_SEED_WORKOUTS,

      addWorkout: (workout) =>
        set((state) => ({
          workouts: [workout, ...state.workouts].sort((a, b) =>
            b.startedAt.localeCompare(a.startedAt),
          ),
        })),

      getWorkoutById: (workoutId) => get().workouts.find((workout) => workout.id === workoutId),

      getWorkoutByDate: (date) => get().workouts.filter((workout) => workout.date === date),

      groupedWorkouts: () => groupWorkoutsByDate(get().workouts),

      clearHistory: () => set({ workouts: [] }),
    }),
    {
      name: "fitness-history-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          const hasOldSeeds = state.workouts?.some((w) => w.id.startsWith("workout-seed-"));
          const hasNewSeeds = state.workouts?.some((w) => w.id.startsWith("workout-prod-"));

          if (hasOldSeeds || !hasNewSeeds || !state.workouts || state.workouts.length === 0) {
            const userWorkouts = (state.workouts || []).filter(
              (w) => !w.id.startsWith("workout-seed-") && !w.id.startsWith("workout-prod-"),
            );
            state.workouts = [...INITIAL_SEED_WORKOUTS, ...userWorkouts].sort((a, b) =>
              b.startedAt.localeCompare(a.startedAt),
            );
          }
        }
      },
    },
  ),
);

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      workouts: [],

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
    },
  ),
);

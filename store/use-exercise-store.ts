import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_EXERCISE_LIBRARY } from "@/data/exercise-library";
import type { Exercise } from "@/types/workout";
import { createId, toIsoDate } from "@/utils/workout";

type AddCustomExerciseInput = {
  name: string;
  muscleGroup: string;
  youtubeUrl: string;
};

type ExerciseStore = {
  exerciseList: Exercise[];
  addCustomExercise: (input: AddCustomExerciseInput) => Exercise;
  updateExercise: (exerciseId: string, input: Partial<AddCustomExerciseInput>) => void;
  getExerciseById: (exerciseId: string) => Exercise | undefined;
};

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    (set, get) => ({
      exerciseList: DEFAULT_EXERCISE_LIBRARY,

      addCustomExercise: ({ name, muscleGroup, youtubeUrl }) => {
        const exercise: Exercise = {
          id: createId("exercise"),
          name: name.trim(),
          muscleGroup: muscleGroup.trim(),
          youtubeUrl: youtubeUrl.trim(),
          isCustom: true,
          createdAt: new Date().toISOString(),
          updatedAt: null,
        };

        set((state) => ({
          exerciseList: [exercise, ...state.exerciseList],
        }));

        return exercise;
      },

      updateExercise: (exerciseId, input) => {
        set((state) => ({
          exerciseList: state.exerciseList.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  name: input.name?.trim() || exercise.name,
                  muscleGroup: input.muscleGroup?.trim() || exercise.muscleGroup,
                  youtubeUrl: input.youtubeUrl?.trim() || exercise.youtubeUrl,
                  updatedAt: toIsoDate(),
                }
              : exercise,
          ),
        }));
      },

      getExerciseById: (exerciseId) =>
        get().exerciseList.find((exercise) => exercise.id === exerciseId),
    }),
    {
      name: "fitness-exercise-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

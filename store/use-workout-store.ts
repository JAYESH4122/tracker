import { create } from "zustand";

import { useExerciseStore } from "@/store/use-exercise-store";
import { useHistoryStore } from "@/store/use-history-store";
import type { ActiveWorkout, Workout, WorkoutExercise, WorkoutSet } from "@/types/workout";
import {
  computeWorkoutVolume,
  createId,
  getExerciseBestWeight,
  getWorkoutSetCount,
  toIsoDate,
} from "@/utils/workout";

type WorkoutStore = {
  activeWorkout: ActiveWorkout | null;
  startWorkout: (name?: string) => ActiveWorkout;
  discardWorkout: () => void;
  addExercise: (exerciseId: string) => WorkoutExercise | null;
  addSet: (workoutExerciseId: string) => WorkoutSet | null;
  updateSet: (
    workoutExerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: string,
  ) => void;
  toggleSetComplete: (workoutExerciseId: string, setId: string) => void;
  removeSet: (workoutExerciseId: string, setId: string) => void;
  completeWorkout: () => Workout | null;
  resumeWorkout: (workout: Workout) => void;
};

function createEmptySet(): WorkoutSet {
  return {
    id: createId("set"),
    reps: null,
    weight: null,
    isCompleted: false,
    completedAt: null,
  };
}

function parseField(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildWorkoutExercise(
  workoutId: string,
  exerciseId: string,
  orderIndex: number,
): WorkoutExercise | null {
  const exercise = useExerciseStore.getState().getExerciseById(exerciseId);
  if (!exercise) return null;

  return {
    id: createId("workout-exercise"),
    workoutId,
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    muscleGroup: exercise.muscleGroup,
    youtubeUrl: exercise.youtubeUrl,
    orderIndex,
    sets: [createEmptySet()],
    newPr: false,
    prWeight: null,
  };
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeWorkout: null,

  startWorkout: (name = "Strength Session") => {
    const workout: ActiveWorkout = {
      id: createId("workout"),
      name,
      startedAt: new Date().toISOString(),
      exercises: [],
    };

    set({ activeWorkout: workout });
    return workout;
  },

  discardWorkout: () => set({ activeWorkout: null }),

  addExercise: (exerciseId) => {
    const { activeWorkout } = get();
    const workout = activeWorkout ?? get().startWorkout();

    if (workout.exercises.some((exercise) => exercise.exerciseId === exerciseId)) {
      return workout.exercises.find((exercise) => exercise.exerciseId === exerciseId) ?? null;
    }

    const workoutExercise = buildWorkoutExercise(
      workout.id,
      exerciseId,
      workout.exercises.length + 1,
    );
    if (!workoutExercise) return null;

    set({
      activeWorkout: {
        ...workout,
        exercises: [...workout.exercises, workoutExercise],
      },
    });

    return workoutExercise;
  },

  addSet: (workoutExerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return null;

    const nextSet = createEmptySet();
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((exercise) =>
          exercise.id === workoutExerciseId
            ? { ...exercise, sets: [...exercise.sets, nextSet] }
            : exercise,
        ),
      },
    });

    return nextSet;
  },

  updateSet: (workoutExerciseId, setId, field, value) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const parsedValue = parseField(value);

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((exercise) =>
          exercise.id === workoutExerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((setItem) =>
                  setItem.id === setId
                    ? {
                        ...setItem,
                        [field]: parsedValue,
                      }
                    : setItem,
                ),
              }
            : exercise,
        ),
      },
    });
  },

  toggleSetComplete: (workoutExerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((exercise) =>
          exercise.id === workoutExerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((setItem) =>
                  setItem.id === setId
                    ? {
                        ...setItem,
                        isCompleted: !setItem.isCompleted,
                        completedAt: !setItem.isCompleted ? new Date().toISOString() : null,
                      }
                    : setItem,
                ),
              }
            : exercise,
        ),
      },
    });
  },

  removeSet: (workoutExerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((exercise) =>
          exercise.id === workoutExerciseId
            ? {
                ...exercise,
                sets:
                  exercise.sets.length > 1
                    ? exercise.sets.filter((setItem) => setItem.id !== setId)
                    : exercise.sets,
              }
            : exercise,
        ),
      },
    });
  },

  completeWorkout: () => {
    const { activeWorkout } = get();
    if (!activeWorkout || activeWorkout.exercises.length === 0) {
      return null;
    }

    const workoutId = activeWorkout.id;
    const workoutSet = activeWorkout.exercises.map((exercise) => ({
      ...exercise,
      workoutId,
    }));
    const draftWorkout: Workout = {
      id: workoutId,
      name: activeWorkout.name,
      date: toIsoDate(new Date(activeWorkout.startedAt)),
      startedAt: activeWorkout.startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds: Math.max(
        0,
        Math.round((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 1000),
      ),
      exercises: workoutSet,
      totalVolume: 0,
      exerciseCount: workoutSet.length,
      setCount: workoutSet.reduce((sum, exercise) => sum + exercise.sets.length, 0),
      notes: null,
    };

    const history = useHistoryStore.getState().workouts;
    const updatedExercises = draftWorkout.exercises.map((exercise) => {
      const previousBest = getExerciseBestWeight(history, exercise.exerciseId);
      const currentBest = exercise.sets.reduce((max, setItem) => {
        return setItem.weight !== null ? Math.max(max, setItem.weight) : max;
      }, 0);
      const newPr = currentBest > previousBest && currentBest > 0;

      return {
        ...exercise,
        newPr,
        prWeight: newPr ? currentBest : previousBest || currentBest || null,
      };
    });

    const completedWorkout: Workout = {
      ...draftWorkout,
      exercises: updatedExercises,
      totalVolume: computeWorkoutVolume({
        ...draftWorkout,
        exercises: updatedExercises,
      }),
      setCount: getWorkoutSetCount({
        ...draftWorkout,
        exercises: updatedExercises,
      }),
    };

    useHistoryStore.getState().addWorkout(completedWorkout);
    set({ activeWorkout: null });
    return completedWorkout;
  },

  resumeWorkout: (workout) => {
    const history = useHistoryStore.getState().workouts;
    const filteredHistory = history.filter((w) => w.id !== workout.id);
    useHistoryStore.setState({ workouts: filteredHistory });

    set({
      activeWorkout: {
        id: workout.id,
        name: workout.name,
        startedAt: workout.startedAt,
        exercises: workout.exercises,
      },
    });
  },
}));

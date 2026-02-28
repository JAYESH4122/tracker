import { create } from 'zustand';
import { MuscleGroup } from '../constants/exercises';

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
  notes: string;
}

export interface Workout {
  id: string;
  date: string;
  startTime: number;
  endTime?: number;
  exercises: WorkoutExercise[];
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

interface WorkoutStore {
  activeWorkout: Workout | null;
  workoutHistory: Workout[];
  personalRecords: Record<string, PersonalRecord>;
  currentStreak: number;
  highestStreak: number;
  lastWorkoutDate: string | null;

  startWorkout: () => void;
  endWorkout: () => void;
  addExercise: (exercise: Omit<WorkoutExercise, 'sets' | 'notes'>) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<WorkoutSet>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  setExerciseNotes: (exerciseId: string, notes: string) => void;
}

const generateId = () => Math.random().toString(36).slice(2);

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeWorkout: null,
  workoutHistory: generateMockHistory(),
  personalRecords: generateMockPRs(),
  currentStreak: 5,
  highestStreak: 12,
  lastWorkoutDate: new Date().toISOString().split('T')[0],

  startWorkout: () => {
    set({
      activeWorkout: {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        startTime: Date.now(),
        exercises: [],
      },
    });
  },

  endWorkout: () => {
    const { activeWorkout, workoutHistory } = get();
    if (!activeWorkout) return;
    const completed = { ...activeWorkout, endTime: Date.now() };
    set({
      activeWorkout: null,
      workoutHistory: [completed, ...workoutHistory],
    });
  },

  addExercise: (exercise) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    const newExercise: WorkoutExercise = {
      ...exercise,
      sets: [{ id: generateId(), reps: 10, weight: 60, completed: false }],
      notes: '',
    };
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: [...activeWorkout.exercises, newExercise],
      },
    });
  },

  removeExercise: (exerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.filter((e) => e.id !== exerciseId),
      },
    });
  },

  addSet: (exerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((e) =>
          e.id === exerciseId
            ? {
                ...e,
                sets: [
                  ...e.sets,
                  {
                    id: generateId(),
                    reps: e.sets[e.sets.length - 1]?.reps ?? 10,
                    weight: e.sets[e.sets.length - 1]?.weight ?? 60,
                    completed: false,
                  },
                ],
              }
            : e
        ),
      },
    });
  },

  updateSet: (exerciseId, setId, data) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((e) =>
          e.id === exerciseId
            ? {
                ...e,
                sets: e.sets.map((s) => (s.id === setId ? { ...s, ...data } : s)),
              }
            : e
        ),
      },
    });
  },

  removeSet: (exerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((e) =>
          e.id === exerciseId ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e
        ),
      },
    });
  },

  completeSet: (exerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((e) =>
          e.id === exerciseId
            ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, completed: true } : s)) }
            : e
        ),
      },
    });
  },

  setExerciseNotes: (exerciseId, notes) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((e) =>
          e.id === exerciseId ? { ...e, notes } : e
        ),
      },
    });
  },
}));

function generateMockHistory(): Workout[] {
  const exercises = [
    { id: '1', name: 'Bench Press', muscleGroup: 'Chest' as MuscleGroup },
    { id: '2', name: 'Squat', muscleGroup: 'Legs' as MuscleGroup },
    { id: '3', name: 'Deadlift', muscleGroup: 'Back' as MuscleGroup },
    { id: '4', name: 'Overhead Press', muscleGroup: 'Shoulders' as MuscleGroup },
  ];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `hist_${i}`,
    date: new Date(Date.now() - i * 86400000 * 1.5).toISOString().split('T')[0],
    startTime: Date.now() - i * 86400000 * 1.5,
    endTime: Date.now() - i * 86400000 * 1.5 + 3600000,
    exercises: [exercises[i % exercises.length]].map((ex) => ({
      ...ex,
      notes: '',
      sets: Array.from({ length: 4 }, (_, j) => ({
        id: `s_${i}_${j}`,
        reps: 8 + j,
        weight: 80 + j * 5,
        completed: true,
      })),
    })),
  }));
}

function generateMockPRs(): Record<string, PersonalRecord> {
  return {
    'Bench Press': { exerciseName: 'Bench Press', weight: 120, reps: 1, date: '2024-01-15' },
    Squat: { exerciseName: 'Squat', weight: 160, reps: 1, date: '2024-01-20' },
    Deadlift: { exerciseName: 'Deadlift', weight: 200, reps: 1, date: '2024-01-22' },
    'Overhead Press': { exerciseName: 'Overhead Press', weight: 80, reps: 1, date: '2024-01-18' },
  };
}
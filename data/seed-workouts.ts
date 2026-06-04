import { DEFAULT_EXERCISE_LIBRARY } from "@/data/exercise-library";
import type { Workout, WorkoutExercise, WorkoutSet } from "@/types/workout";

let setCounter = 0;
let exerciseCounter = 0;

function createSet(weight: number, reps: number, completedAt: string): WorkoutSet {
  setCounter++;
  return {
    id: `set-seed-${setCounter}`,
    weight,
    reps,
    isCompleted: true,
    completedAt,
  };
}

function compileExercise(
  workoutId: string,
  exerciseId: string,
  weights: number[],
  reps: number = 12,
  completedAt: string,
  orderIndex: number,
): WorkoutExercise {
  exerciseCounter++;
  const defaultEx = DEFAULT_EXERCISE_LIBRARY.find((e) => e.id === exerciseId);

  const sets = weights.map((w) => createSet(w, reps, completedAt));
  const maxWeight = Math.max(...weights);

  return {
    id: `workout-exercise-seed-${exerciseCounter}`,
    workoutId,
    exerciseId,
    exerciseName: defaultEx?.name || exerciseId.replace(/-/g, " "),
    muscleGroup: defaultEx?.muscleGroup || "Chest",
    youtubeUrl: defaultEx?.youtubeUrl || "",
    orderIndex,
    sets,
    newPr: true, // Mark seeded exercises as PRs for stats
    prWeight: maxWeight,
  };
}

const RAW_WORKOUTS = [
  {
    id: "workout-prod-week1-monday",
    name: "Monday - Chest & Shoulders",
    date: "2026-05-25",
    startedAt: "2026-05-25T18:00:00.000Z",
    endedAt: "2026-05-25T19:15:00.000Z",
    durationSeconds: 4500,
    exercises: [
      { id: "flat-bench", weights: [10, 15, 20] },
      { id: "incline-bench", weights: [10, 10, 15] },
      { id: "decline-bench", weights: [10, 10, 15] },
      { id: "machine-flys", weights: [35, 40, 40] },
      { id: "lateral-raise", weights: [7.5, 7.5, 7.5] },
      { id: "shoulder-press-machine", weights: [10, 10, 10] },
    ],
  },
  {
    id: "workout-prod-week1-tuesday",
    name: "Tuesday - Biceps & Back",
    date: "2026-05-26",
    startedAt: "2026-05-26T18:00:00.000Z",
    endedAt: "2026-05-26T19:10:00.000Z",
    durationSeconds: 4200,
    exercises: [
      { id: "hammer-curl", weights: [10, 10, 12] },
      { id: "machine-bicep-curl", weights: [7.5, 7.5, 10] },
      { id: "barbell-curl", weights: [7.5, 7.5, 10] },
      { id: "cable-bicep-curl", weights: [30, 30, 30] },
      { id: "lat-pulldown", weights: [35, 35, 40] },
    ],
  },
  {
    id: "workout-prod-week1-wednesday",
    name: "Wednesday - Shoulders & Triceps",
    date: "2026-05-27",
    startedAt: "2026-05-27T18:00:00.000Z",
    endedAt: "2026-05-27T19:20:00.000Z",
    durationSeconds: 4800,
    exercises: [
      { id: "machine-press-shoulder-up", weights: [10, 15, 20] },
      { id: "machine-press-shoulder-back-up", weights: [10, 15, 20] },
      { id: "lateral-raise", weights: [7.5, 7.5, 10] },
      { id: "face-pull", weights: [25, 30, 30] },
      { id: "cable-bar-pull-down", weights: [40, 40, 45] },
      { id: "cable-straight-bar-overhead", weights: [25, 30, 30] },
    ],
  },
  {
    id: "workout-prod-week1-thursday",
    name: "Thursday - Back & Forearms",
    date: "2026-05-28",
    startedAt: "2026-05-28T18:00:00.000Z",
    endedAt: "2026-05-28T19:15:00.000Z",
    durationSeconds: 4500,
    exercises: [
      { id: "lat-pulldown", weights: [30, 30, 35] },
      { id: "bentover-row", weights: [10, 20, 20] },
      { id: "cable-rear-delt-pullaparts", weights: [10, 15, 15] },
      { id: "straight-arm-cable-pulldown", weights: [15, 15, 20] },
      { id: "dumbbell-twist", weights: [10, 10, 10] },
      { id: "wrist-curl-machine", weights: [15, 15, 15] },
    ],
  },
  {
    id: "workout-prod-week1-friday",
    name: "Friday - Chest & Triceps",
    date: "2026-05-29",
    startedAt: "2026-05-29T18:00:00.000Z",
    endedAt: "2026-05-29T19:10:00.000Z",
    durationSeconds: 4200,
    exercises: [
      { id: "flat-bench", weights: [10, 15, 15] },
      { id: "dumbbell-flat-flys", weights: [10, 10, 10] },
      { id: "machine-flys", weights: [30, 30, 35] },
      { id: "cable-rope-push-down-triceps", weights: [30, 35, 35] },
      { id: "cable-bar-over-head-triceps", weights: [30, 30, 30] },
    ],
  },
  {
    id: "workout-prod-week1-saturday",
    name: "Saturday - Legs",
    date: "2026-05-30",
    startedAt: "2026-05-30T10:00:00.000Z",
    endedAt: "2026-05-30T11:15:00.000Z",
    durationSeconds: 4500,
    exercises: [
      { id: "barbell-leg-squat", weights: [20, 20, 30] },
      { id: "super-squat-machine", weights: [120, 140, 160] },
      { id: "machine-leg-press", weights: [140, 160, 160] },
      { id: "goblet-squat", weights: [40, 40, 40] },
      { id: "front-leg-extension", weights: [20, 20, 20] },
    ],
  },
  {
    id: "workout-prod-week2-monday",
    name: "Monday - Chest & Shoulders",
    date: "2026-06-01",
    startedAt: "2026-06-01T18:00:00.000Z",
    endedAt: "2026-06-01T19:15:00.000Z",
    durationSeconds: 4500,
    exercises: [
      { id: "flat-bench", weights: [10, 20, 20] },
      { id: "decline-bench", weights: [10, 20, 20] },
      { id: "machine-flys", weights: [35, 40, 40] },
      { id: "cable-chest-press", weights: [15, 15, 20] },
      { id: "shoulder-press-machine", weights: [7.5, 7.5, 10] },
      { id: "lateral-raise", weights: [10, 10, 12.5] },
    ],
  },
  {
    id: "workout-prod-week2-wednesday",
    name: "Wednesday - Biceps & Back",
    date: "2026-06-03",
    startedAt: "2026-06-03T18:00:00.000Z",
    endedAt: "2026-06-03T19:15:00.000Z",
    durationSeconds: 4500,
    exercises: [
      { id: "hammer-curl", weights: [10, 10, 12] },
      { id: "cable-bicep-curl", weights: [20, 20, 30] },
      { id: "preacher-curl-bar", weights: [10, 10, 10] },
      { id: "barbell-curl", weights: [10, 10, 10] },
      { id: "bentover-row", weights: [10, 10, 10] },
      { id: "lat-pulldown", weights: [20, 20, 20] },
    ],
  },
];

export const INITIAL_SEED_WORKOUTS: Workout[] = RAW_WORKOUTS.map((raw) => {
  const exercises = raw.exercises.map((ex, orderIndex) =>
    compileExercise(raw.id, ex.id, ex.weights, 12, raw.endedAt, orderIndex + 1),
  );

  const totalVolume = exercises.reduce((sum, ex) => {
    return sum + ex.sets.reduce((setSum, set) => setSum + (set.weight || 0) * (set.reps || 0), 0);
  }, 0);

  const setCount = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  return {
    id: raw.id,
    name: raw.name,
    date: raw.date,
    startedAt: raw.startedAt,
    endedAt: raw.endedAt,
    durationSeconds: raw.durationSeconds,
    exercises,
    totalVolume,
    exerciseCount: exercises.length,
    setCount,
    notes: null,
  };
});

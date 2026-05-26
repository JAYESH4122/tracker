export type ISODateString = string;

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  youtubeUrl: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type WorkoutSet = {
  id: string;
  reps: number | null;
  weight: number | null;
  isCompleted: boolean;
  completedAt: string | null;
};

export type WorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  youtubeUrl: string;
  orderIndex: number;
  sets: WorkoutSet[];
  newPr: boolean;
  prWeight: number | null;
};

export type Workout = {
  id: string;
  name: string;
  date: ISODateString;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  exercises: WorkoutExercise[];
  totalVolume: number;
  exerciseCount: number;
  setCount: number;
  notes: string | null;
};

export type ActiveWorkout = {
  id: string;
  name: string;
  startedAt: string;
  exercises: WorkoutExercise[];
};

export type WorkoutHistoryGroup = {
  date: ISODateString;
  workouts: Workout[];
};

export type PersonalRecord = {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  maxWeight: number;
  workoutId: string;
  workoutDate: ISODateString;
  youtubeUrl: string;
};

export type PostgresWorkoutRow = {
  id: string;
  name: string;
  date: ISODateString;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  total_volume: number;
  exercise_count: number;
  set_count: number;
  notes: string | null;
};

export type PostgresExerciseRow = {
  id: string;
  name: string;
  muscle_group: string;
  youtube_url: string;
  is_custom: boolean;
  created_at: string;
  updated_at: string | null;
};

export type PostgresWorkoutExerciseRow = {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  exercise_name: string;
  muscle_group: string;
  youtube_url: string;
  new_pr: boolean;
  pr_weight: number | null;
};

export type PostgresWorkoutSetRow = {
  id: string;
  workout_exercise_id: string;
  reps: number | null;
  weight: number | null;
  is_completed: boolean;
  completed_at: string | null;
  order_index: number;
};

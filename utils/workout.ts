import type {
  Exercise,
  PersonalRecord,
  Workout,
  WorkoutExercise,
  WorkoutHistoryGroup,
  WorkoutSet,
} from "@/types/workout";

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toIsoDate(date = new Date()): string {
  return date.toISOString().split("T")[0] ?? "";
}

export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function formatDateLabel(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function parseWorkoutValue(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatWorkoutValue(value: number | null): string {
  return value === null ? "" : Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function formatSetPreview(set: Pick<WorkoutSet, "weight" | "reps">): string {
  const parts: string[] = [];
  if (set.weight !== null) {
    parts.push(`${formatWorkoutValue(set.weight)} kg`);
  }
  if (set.reps !== null) {
    parts.push(`${formatWorkoutValue(set.reps)} reps`);
  }
  return parts.length > 0 ? parts.join(" × ") : "—";
}

export function getYouTubeVideoId(youtubeUrl: string): string | null {
  try {
    const url = new URL(youtubeUrl);
    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.replace("/", "");
      return videoId || null;
    }

    if (url.searchParams.has("v")) {
      return url.searchParams.get("v");
    }

    const segments = url.pathname.split("/").filter(Boolean);
    return segments.length > 0 ? (segments[segments.length - 1] ?? null) : null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnailUrl(youtubeUrl: string): string | null {
  const videoId = getYouTubeVideoId(youtubeUrl);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

export function computeSetVolume(set: Pick<WorkoutSet, "reps" | "weight">): number {
  if (set.reps === null || set.weight === null) {
    return 0;
  }

  return set.reps * set.weight;
}

export function computeExerciseVolume(exercise: WorkoutExercise): number {
  return exercise.sets.reduce((sum, set) => sum + computeSetVolume(set), 0);
}

export function computeWorkoutVolume(workout: Pick<Workout, "exercises">): number {
  return workout.exercises.reduce((sum, exercise) => sum + computeExerciseVolume(exercise), 0);
}

export function getWorkoutSetCount(workout: Pick<Workout, "exercises">): number {
  return workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
}

export function groupWorkoutsByDate(workouts: Workout[]): WorkoutHistoryGroup[] {
  const map = new Map<string, Workout[]>();

  workouts.forEach((workout) => {
    const dateWorkouts = map.get(workout.date) ?? [];
    dateWorkouts.push(workout);
    map.set(workout.date, dateWorkouts);
  });

  return Array.from(map.entries()).map(([date, groupedWorkouts]) => ({
    date,
    workouts: groupedWorkouts.sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
  }));
}

export function getWeekStart(date = new Date()): Date {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + offset);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export function isWithinCurrentWeek(dateValue: string, referenceDate = new Date()): boolean {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  const weekStart = getWeekStart(referenceDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return date >= weekStart && date < weekEnd;
}

export function getWorkoutBestWeight(workout: Pick<Workout, "exercises">): number {
  return workout.exercises.reduce((maxWeight, exercise) => {
    const exerciseMax = exercise.sets.reduce((exerciseMaxWeight, set) => {
      return set.weight !== null ? Math.max(exerciseMaxWeight, set.weight) : exerciseMaxWeight;
    }, 0);
    return Math.max(maxWeight, exerciseMax);
  }, 0);
}

export function getExerciseBestWeight(workouts: Workout[], exerciseId: string): number {
  return workouts.reduce((maxWeight, workout) => {
    const exercise = workout.exercises.find((item) => item.exerciseId === exerciseId);
    if (!exercise) return maxWeight;

    const currentMax = exercise.sets.reduce((exerciseMaxWeight, set) => {
      return set.weight !== null ? Math.max(exerciseMaxWeight, set.weight) : exerciseMaxWeight;
    }, 0);

    return Math.max(maxWeight, currentMax);
  }, 0);
}

export function getExerciseLatestPR(
  workouts: Workout[],
  exerciseId: string,
): PersonalRecord | null {
  let record: PersonalRecord | null = null;

  workouts.forEach((workout) => {
    const exercise = workout.exercises.find((item) => item.exerciseId === exerciseId);
    if (!exercise) return;

    const maxWeight = exercise.sets.reduce((max, set) => {
      return set.weight !== null ? Math.max(max, set.weight) : max;
    }, 0);

    if (maxWeight === 0) return;
    if (!record || maxWeight >= record.maxWeight) {
      record = {
        exerciseId,
        exerciseName: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        maxWeight,
        workoutId: workout.id,
        workoutDate: workout.date,
        youtubeUrl: exercise.youtubeUrl,
      };
    }
  });

  return record;
}

export function getExerciseRecentPerformance(
  workouts: Workout[],
  exerciseId: string,
  limit = 3,
): {
  workoutId: string;
  workoutDate: string;
  maxWeight: number;
  reps: number | null;
}[] {
  const entries: {
    workoutId: string;
    workoutDate: string;
    maxWeight: number;
    reps: number | null;
  }[] = [];

  workouts
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .forEach((workout) => {
      if (entries.length >= limit) return;

      const exercise = workout.exercises.find((item) => item.exerciseId === exerciseId);
      if (!exercise) return;

      let bestSet: WorkoutSet | null = null;
      exercise.sets.forEach((set) => {
        if (set.weight === null) return;
        if (!bestSet || (bestSet.weight ?? 0) < set.weight) {
          bestSet = set;
        }
      });

      if (!bestSet) return;

      const finalSet = bestSet as WorkoutSet;
      entries.push({
        workoutId: workout.id,
        workoutDate: workout.date,
        maxWeight: finalSet.weight ?? 0,
        reps: finalSet.reps,
      });
    });

  return entries;
}

export function getExercisePreviousSetPreview(
  workouts: Workout[],
  exerciseId: string,
): string | null {
  const recentPerformance = getExerciseRecentPerformance(workouts, exerciseId, 1)[0];
  if (!recentPerformance) {
    return null;
  }

  const parts: string[] = [];
  if (recentPerformance.maxWeight !== null) {
    parts.push(`${formatWorkoutValue(recentPerformance.maxWeight)} kg`);
  }
  if (recentPerformance.reps !== null) {
    parts.push(`${formatWorkoutValue(recentPerformance.reps)} reps`);
  }

  return parts.length > 0 ? parts.join(" × ") : null;
}

export function flattenWorkoutExercises(workouts: Workout[]): Exercise[] {
  const map = new Map<string, Exercise>();

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      if (map.has(exercise.exerciseId)) return;

      map.set(exercise.exerciseId, {
        id: exercise.exerciseId,
        name: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        youtubeUrl: exercise.youtubeUrl,
        isCustom: false,
        createdAt: workout.startedAt,
        updatedAt: null,
      });
    });
  });

  return Array.from(map.values());
}

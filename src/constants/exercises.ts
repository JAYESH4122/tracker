export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Arms"
  | "Legs"
  | "Core";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
}

export const EXERCISES: Exercise[] = [
  { id: "bench_press", name: "Bench Press", muscleGroup: "Chest" },
  { id: "incline_bench", name: "Incline Bench Press", muscleGroup: "Chest" },
  { id: "cable_fly", name: "Cable Fly", muscleGroup: "Chest" },
  { id: "push_up", name: "Push Up", muscleGroup: "Chest" },
  { id: "deadlift", name: "Deadlift", muscleGroup: "Back" },
  { id: "pull_up", name: "Pull Up", muscleGroup: "Back" },
  { id: "lat_pulldown", name: "Lat Pulldown", muscleGroup: "Back" },
  { id: "bent_over_row", name: "Bent Over Row", muscleGroup: "Back" },
  { id: "ohp", name: "Overhead Press", muscleGroup: "Shoulders" },
  { id: "lateral_raise", name: "Lateral Raise", muscleGroup: "Shoulders" },
  { id: "front_raise", name: "Front Raise", muscleGroup: "Shoulders" },
  { id: "bicep_curl", name: "Bicep Curl", muscleGroup: "Arms" },
  { id: "tricep_pushdown", name: "Tricep Pushdown", muscleGroup: "Arms" },
  { id: "hammer_curl", name: "Hammer Curl", muscleGroup: "Arms" },
  { id: "squat", name: "Squat", muscleGroup: "Legs" },
  { id: "leg_press", name: "Leg Press", muscleGroup: "Legs" },
  { id: "leg_curl", name: "Leg Curl", muscleGroup: "Legs" },
  { id: "calf_raise", name: "Calf Raise", muscleGroup: "Legs" },
  { id: "lunges", name: "Lunges", muscleGroup: "Legs" },
  { id: "plank", name: "Plank", muscleGroup: "Core" },
  { id: "crunch", name: "Crunch", muscleGroup: "Core" },
  { id: "ab_rollout", name: "Ab Rollout", muscleGroup: "Core" },
];

export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Chest: "#3B82F6",
  Back: "#8B5CF6",
  Shoulders: "#06B6D4",
  Arms: "#F59E0B",
  Legs: "#22C55E",
  Core: "#EF4444",
};

export const MOTIVATIONAL_QUOTES = [
  "No pain, no gain.",
  "Push past your limits.",
  "Every rep counts.",
  "Be stronger than yesterday.",
  "Consistency is the key.",
  "Earn your rest.",
  "Champions are made in the gym.",
];

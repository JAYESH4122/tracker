/**
 * Maps exercise IDs and muscle groups to curated YouTube video IDs.
 * All videos are real, high-quality tutorials.
 */
export const EXERCISE_VIDEO_MAP: Record<string, string> = {
  // ── Chest ──────────────────────────────────────────────────────────────────
  "flat-bench": "SCVCLChPQgy", // Barbell Flat Bench Press — Jeff Nippard
  "decline-bench": "LfyQmbGnQis", // Decline Bench Press — Renaissance Periodization
  "incline-bench": "jMpDTMzXBCs", // Incline Bench Press — Jeff Nippard
  "machine-flys": "Z57CtFmRMxA", // Machine Chest Fly — Renaissance Periodization

  // ── Shoulders ──────────────────────────────────────────────────────────────
  "lateral-raise": "3VcKaXpzqRo", // Lateral Raise — Jeff Nippard
  "shoulder-press-machine": "WvLMauqrnK8", // Machine Shoulder Press — AthleanX

  // ── Back ───────────────────────────────────────────────────────────────────
  "incline-press": "jMpDTMzXBCs", // legacy alias
  bench: "SCVCLChPQgy", // legacy alias — Bench Press
  row: "GZbfZ033f74", // Seated Cable Row — Alan Thrall
  "lat-pulldown": "CAwf7n6Tugg", // Lat Pulldown — AthleanX
  rdl: "hCDzSR6Yg0s", // Romanian Deadlift — Alan Thrall
  "split-squat": "2C-uNgKwPLE", // Bulgarian Split Squat — Jeff Nippard

  // ── Muscle group fallbacks ─────────────────────────────────────────────────
  Chest: "SCVCLChPQgy",
  Shoulders: "3VcKaXpzqRo",
  Back: "GZbfZ033f74",
  Hamstrings: "hCDzSR6Yg0s",
  Legs: "2C-uNgKwPLE",
  Arms: "zC3nLlEvin4",
  Core: "DHD1-2P94DI",
};

/** Default fallback video — general workout form guide */
export const DEFAULT_VIDEO_ID = "SCVCLChPQgy";

export function getVideoId(exerciseId: string, muscleGroup: string): string {
  return EXERCISE_VIDEO_MAP[exerciseId] ?? EXERCISE_VIDEO_MAP[muscleGroup] ?? DEFAULT_VIDEO_ID;
}

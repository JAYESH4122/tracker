import { Ionicons } from "@expo/vector-icons";

export type StatItem = {
  id: string;
  label: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

export type WorkoutSummary = {
  title: string;
  subtitle: string;
  duration: string;
  calories: string;
};

export type WeeklyProgressItem = {
  id: string;
  day: string;
  value: number;
};

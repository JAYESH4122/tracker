import { create } from "zustand";

import { StatItem, WeeklyProgressItem, WorkoutSummary } from "@/types/home";

type HomeState = {
  greeting: string;
  userName: string;
  summary: WorkoutSummary;
  stats: StatItem[];
  weeklyProgress: WeeklyProgressItem[];
};

export const useHomeStore = create<HomeState>(() => ({
  greeting: "Welcome back",
  userName: "Jayesh",
  summary: {
    title: "Workout of the Day",
    subtitle: "Upper Body Strength",
    duration: "42 min",
    calories: "560 kcal",
  },
  stats: [
    { id: "calories", label: "Calories", value: "1,840", iconName: "flame" },
    { id: "time", label: "Time", value: "6h 20m", iconName: "time" },
    { id: "sessions", label: "Sessions", value: "18", iconName: "barbell" },
  ],
  weeklyProgress: [
    { id: "mon", day: "M", value: 68 },
    { id: "tue", day: "T", value: 55 },
    { id: "wed", day: "W", value: 72 },
    { id: "thu", day: "T", value: 80 },
    { id: "fri", day: "F", value: 60 },
    { id: "sat", day: "S", value: 88 },
    { id: "sun", day: "S", value: 74 },
  ],
}));

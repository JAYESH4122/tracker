export const colors = {
  background: "#0B0B0F",
  card: "#15151C",
  cardElevated: "#1C1D27",
  primary: "#00FF88",
  primaryMuted: "#103826",
  text: "#FFFFFF",
  subtext: "#A1A1AA",
  border: "#262836",
  overlay: "rgba(255, 255, 255, 0.06)",
  danger: "#FF5A6A",
} as const;

export type AppColors = typeof colors;

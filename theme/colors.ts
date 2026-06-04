export const colors = {
  background: "#0F0F0F",
  card: "#1C1C1C",
  cardElevated: "#242424",
  primary: "#D4AF37",
  primaryMuted: "#6E5A1F",
  text: "#E5E2E1",
  subtext: "#A0A0A0",
  border: "rgba(255, 255, 255, 0.08)",
  overlay: "rgba(0, 0, 0, 0.4)",
  danger: "#FF5A6A",
} as const;

export type AppColors = typeof colors;

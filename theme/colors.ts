export const colors = {
  background: "#121212",
  card: "#2A2A2A",
  cardElevated: "#333333",
  primary: "#FFE600",
  primaryMuted: "#716500",
  text: "#E5E2E1",
  subtext: "#CDC7AA",
  border: "#3D3D3D",
  overlay: "rgba(0, 0, 0, 0.4)",
  danger: "#FF1744",
} as const;

export type AppColors = typeof colors;

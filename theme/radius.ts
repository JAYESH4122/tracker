export const radius = {
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export type RadiusScale = typeof radius;

export const radius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  pill: 999,
} as const;

export type RadiusScale = typeof radius;

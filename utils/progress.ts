export const clampPercent = (value: number): number => {
  return Math.min(100, Math.max(0, value));
};

export const percentLabel = (value: number): string => {
  return `${clampPercent(value)}%`;
};

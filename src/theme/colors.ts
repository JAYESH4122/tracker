export const Colors = {
  bg: {
    primary: '#0B0B0F',
    secondary: '#121212',
    tertiary: '#1A1A1D',
  },
  card: {
    primary: '#1C1C22',
    secondary: '#202028',
    border: '#2A2A35',
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#9494A8',
    muted: '#5A5A6E',
  },
  accent: {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    blueLight: '#60A5FA',
    purpleLight: '#A78BFA',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  gradient: {
    blue: ['#3B82F6', '#8B5CF6'] as [string, string],
    dark: ['#1C1C22', '#0B0B0F'] as [string, string],
    card: ['#202028', '#1A1A1D'] as [string, string],
  },
} as const;
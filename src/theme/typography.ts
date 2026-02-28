import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  heroNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: -2,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  number: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: -1,
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
};
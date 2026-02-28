import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  View,
} from 'react-native';
import { Colors, Radius } from '../../theme';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function GradientButton({
  label,
  onPress,
  style,
  textStyle,
  size = 'md',
  variant = 'primary',
  disabled = false,
}: GradientButtonProps) {
  const bgColor =
    variant === 'primary'
      ? Colors.accent.blue
      : variant === 'danger'
      ? Colors.status.error
      : Colors.card.secondary;

  const heights = { sm: 36, md: 48, lg: 56 };
  const fontSizes = { sm: 13, md: 15, lg: 17 };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bgColor,
          height: heights[size],
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize: fontSizes[size] }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
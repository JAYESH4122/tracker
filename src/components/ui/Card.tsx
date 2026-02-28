import React from 'react';
import { View, ViewStyle, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Card({ children, style, onPress, variant = 'primary' }: CardProps) {
  const bg = variant === 'primary' ? Colors.card.primary : Colors.card.secondary;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: bg },
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
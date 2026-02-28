import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

interface ProgressRingProps {
  progress: number; // 0–1
  size?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

// Pure RN version - shows progress as arc approximation using border
export function ProgressRing({
  progress,
  size = 100,
  color = Colors.accent.blue,
  label,
  sublabel,
}: ProgressRingProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer ring bg */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 8,
          borderColor: Colors.card.border,
        }}
      />
      {/* Progress overlay — simplified: color ring with opacity based on progress */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 8,
          borderColor: color,
          opacity: clamped,
        }}
      />
      {label && <Text style={[styles.label, { color, fontSize: size * 0.22 }]}>{label}</Text>}
      {sublabel && <Text style={[styles.sublabel, { fontSize: size * 0.1 }]}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '800' },
  sublabel: {
    color: Colors.text.muted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
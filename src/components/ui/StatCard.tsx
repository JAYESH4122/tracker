import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Colors, Spacing } from '../../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  accent?: string;
  onPress?: () => void;
}

export function StatCard({ label, value, unit, accent = Colors.accent.blue, onPress }: StatCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={[styles.value, { color: accent }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
});
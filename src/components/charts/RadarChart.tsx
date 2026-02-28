import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';
import { MUSCLE_COLORS, MuscleGroup } from '../../constants/exercises';

interface RadarChartProps {
  data: Record<MuscleGroup, number>;
}

export function RadarChart({ data }: RadarChartProps) {
  const muscles = Object.keys(data) as MuscleGroup[];
  const max = Math.max(...Object.values(data), 1);

  return (
    <View style={styles.container}>
      {muscles.map((muscle) => {
        const pct = data[muscle] / max;
        return (
          <View key={muscle} style={styles.row}>
            <Text style={styles.label}>{muscle}</Text>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${Math.max(pct * 100, data[muscle] > 0 ? 4 : 0)}%`,
                    backgroundColor: MUSCLE_COLORS[muscle],
                  },
                ]}
              />
            </View>
            <Text style={[styles.value, { color: MUSCLE_COLORS[muscle] }]}>
              {data[muscle]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { width: 72, fontSize: 12, color: Colors.text.secondary, fontWeight: '600' },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.card.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: { height: '100%', borderRadius: 4, minWidth: 4 },
  value: { width: 28, fontSize: 12, fontWeight: '800', textAlign: 'right' },
});
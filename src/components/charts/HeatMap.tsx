import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../theme';

interface HeatmapProps {
  data: Record<string, number>;
  weeks?: number;
}

export function Heatmap({ data, weeks = 12 }: HeatmapProps) {
  const today = new Date();
  const grid: { date: string; value: number }[][] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const week: { date: string; value: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      const key = date.toISOString().split('T')[0];
      week.push({ date: key, value: data[key] ?? 0 });
    }
    grid.push(week);
  }

  const max = Math.max(...Object.values(data), 1);
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.wrapper}>
      <View style={styles.dayCol}>
        <View style={styles.spacer} />
        {dayLabels.map((d, i) => (
          <Text key={i} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {grid.map((week, wi) => (
            <View key={wi} style={styles.weekCol}>
              {week.map((day, di) => {
                const intensity = day.value > 0 ? 0.2 + (day.value / max) * 0.8 : 0;
                return (
                  <View
                    key={di}
                    style={[
                      styles.cell,
                      {
                        backgroundColor:
                          day.value === 0
                            ? Colors.card.border
                            : `rgba(59,130,246,${intensity})`,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row' },
  dayCol: { marginRight: 6, gap: 2 },
  spacer: { height: 0 },
  dayLabel: { fontSize: 9, color: Colors.text.muted, height: 14, lineHeight: 14 },
  grid: { flexDirection: 'row', gap: 2 },
  weekCol: { gap: 2 },
  cell: { width: 14, height: 14, borderRadius: 2 },
});
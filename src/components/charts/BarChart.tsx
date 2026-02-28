import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export function BarChart({ data, color = Colors.accent.blue, height = 120 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.chart, { height }]}>
        {data.map((item, i) => {
          const pct = item.value > 0 ? Math.max((item.value / max) * 100, 5) : 0;
          return (
            <View key={i} style={styles.barWrapper}>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: pct > 0 ? `${pct}%` : 0,
                      backgroundColor: color,
                      opacity: 0.6 + (i / Math.max(data.length - 1, 1)) * 0.4,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((item, i) => (
          <Text key={i} style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barBg: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.card.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 5,
    minHeight: 3,
  },
  labels: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 5,
  },
  label: {
    flex: 1,
    fontSize: 10,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});
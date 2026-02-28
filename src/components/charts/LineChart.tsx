import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export function LineChart({ data, color = Colors.accent.blue, height = 120 }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value));
  const range = Math.max(max - min, 1);

  return (
    <View>
      <View style={[styles.chart, { height }]}>
        {data.map((item, i) => {
          const pct = ((item.value - min) / range) * 100;
          return (
            <View key={i} style={styles.colWrapper}>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                  style={[
                    styles.col,
                    {
                      height: `${Math.max(pct, 4)}%`,
                      backgroundColor: color + '30',
                      borderTopColor: color,
                      borderTopWidth: 2.5,
                    },
                  ]}
                />
              </View>
              <View style={[styles.dot, { backgroundColor: color }]} />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((item, i) => (
          <Text key={i} style={styles.label}>{item.label}</Text>
        ))}
      </View>
      <View style={styles.values}>
        {data.map((item, i) => (
          <Text key={i} style={[styles.value, { color }]}>
            {item.value > 0 ? item.value.toFixed(0) : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  colWrapper: { flex: 1, alignItems: 'center' },
  col: { width: '100%', borderRadius: 3, minHeight: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: -3 },
  labels: { flexDirection: 'row', marginTop: 8, gap: 4 },
  label: { flex: 1, fontSize: 10, color: Colors.text.muted, textAlign: 'center' },
  values: { flexDirection: 'row', gap: 4, marginTop: 4 },
  value: { flex: 1, fontSize: 10, fontWeight: '700', textAlign: 'center' },
});
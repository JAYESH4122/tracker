import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useWorkoutStore } from '@/src/store/workout-store';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { RadarChart } from '../../components/charts/RadarChart';
import { Heatmap } from '@/src/components/charts/HeatMap';
import { Colors, Spacing } from '../../theme';
import { MuscleGroup } from '../../constants/exercises';

export function AnalyticsScreen() {
  const { workoutHistory, currentStreak, highestStreak } = useWorkoutStore();

  const weeklyVolumeData = useMemo(() => {
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
    return weeks.map((label, i) => {
      const weekStart = Date.now() - (weeks.length - i) * 7 * 86400000;
      const weekEnd = weekStart + 7 * 86400000;
      const vol = workoutHistory
        .filter((w) => w.startTime >= weekStart && w.startTime < weekEnd)
        .reduce(
          (sum, w) =>
            sum +
            w.exercises.reduce(
              (es, e) => es + e.sets.reduce((ss, s) => ss + s.reps * s.weight, 0),
              0
            ),
          0
        );
      return { label, value: vol / 1000 };
    });
  }, [workoutHistory]);

  const strengthData = useMemo(() => {
    const benchSets = workoutHistory
      .filter((w) => w.exercises.some((e) => e.name === 'Bench Press'))
      .slice(0, 8)
      .reverse()
      .map((w, i) => {
        const bench = w.exercises.find((e) => e.name === 'Bench Press');
        const maxWeight = bench ? Math.max(...bench.sets.map((s) => s.weight)) : 0;
        return { label: `W${i + 1}`, value: maxWeight };
      });
    return benchSets.length > 0
      ? benchSets
      : [60, 65, 70, 72, 75, 80, 82, 85].map((v, i) => ({ label: `W${i + 1}`, value: v }));
  }, [workoutHistory]);

  const muscleData = useMemo(() => {
    const counts: Record<MuscleGroup, number> = {
      Chest: 0, Back: 0, Shoulders: 0, Arms: 0, Legs: 0, Core: 0,
    };
    const weekAgo = Date.now() - 28 * 86400000;
    workoutHistory
      .filter((w) => w.startTime > weekAgo)
      .forEach((w) =>
        w.exercises.forEach((e) => {
          counts[e.muscleGroup] = (counts[e.muscleGroup] ?? 0) + e.sets.length;
        })
      );
    return counts;
  }, [workoutHistory]);

  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    workoutHistory.forEach((w) => {
      const vol = w.exercises.reduce(
        (sum, e) => sum + e.sets.reduce((ss, s) => ss + s.reps * s.weight, 0),
        0
      );
      data[w.date] = (data[w.date] ?? 0) + vol / 1000;
    });
    return data;
  }, [workoutHistory]);

  const totalVolume = workoutHistory.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce(
        (es, e) => es + e.sets.reduce((ss, s) => ss + s.reps * s.weight, 0),
        0
      ),
    0
  );

  const avgDuration = useMemo(() => {
    const withDuration = workoutHistory.filter((w) => w.endTime);
    if (!withDuration.length) return 0;
    return Math.round(
      withDuration.reduce((sum, w) => sum + (w.endTime! - w.startTime) / 60000, 0) /
        withDuration.length
    );
  }, [workoutHistory]);

  const mostTrainedMuscle = useMemo(() => {
    const entries = Object.entries(muscleData) as [MuscleGroup, number][];
    if (!entries.length) return 'N/A';
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [muscleData]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Analytics</Text>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <StatCard label="Total Volume" value={(totalVolume / 1000).toFixed(0)} unit="t" />
        <StatCard
          label="Best Streak"
          value={highestStreak}
          unit="days"
          accent={Colors.status.warning}
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard label="Avg Duration" value={avgDuration} unit="min" accent={Colors.accent.purple} />
        <StatCard label="Workouts" value={workoutHistory.length} accent={Colors.status.success} />
      </View>

      {/* Streak */}
      <Card style={styles.section}>
        <SectionHeader title="Streak" />
        <View style={styles.streakRow}>
          <Text style={styles.streakFire}>🔥</Text>
          <View>
            <Text style={styles.streakNum}>{currentStreak} days</Text>
            <Text style={styles.streakSub}>Best: {highestStreak} days</Text>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakLabel}>CONSISTENCY</Text>
            <Text style={styles.streakPct}>
              {Math.round((workoutHistory.length / 30) * 100)}%
            </Text>
          </View>
        </View>
      </Card>

      {/* Weekly Volume */}
      <Card style={styles.section}>
        <SectionHeader title="Weekly Volume (tonnes)" />
        <BarChart data={weeklyVolumeData} height={140} color={Colors.accent.blue} />
      </Card>

      {/* Strength Progression */}
      <Card style={styles.section}>
        <SectionHeader title="Bench Press Progression" />
        <LineChart data={strengthData} color={Colors.accent.purple} height={130} />
      </Card>

      {/* Heatmap */}
      <Card style={styles.section}>
        <SectionHeader title="Activity Calendar" />
        <Heatmap data={heatmapData} weeks={12} />
      </Card>

      {/* Muscle Balance */}
      <Card style={styles.section}>
        <SectionHeader title="Muscle Balance (4 weeks)" />
        <RadarChart data={muscleData} />
        {mostTrainedMuscle !== 'N/A' && (
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightText}>
              Most trained: <Text style={{ color: Colors.accent.blue }}>{mostTrainedMuscle}</Text>
            </Text>
          </View>
        )}
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    padding: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    letterSpacing: -1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  section: {
    marginBottom: Spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakFire: {
    fontSize: 40,
  },
  streakNum: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.status.warning,
  },
  streakSub: {
    fontSize: 13,
    color: Colors.text.muted,
    marginTop: 2,
  },
  streakRight: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  streakPct: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.accent.blue,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: Colors.accent.blue + '11',
    padding: 10,
    borderRadius: 10,
  },
  insightIcon: {
    fontSize: 16,
  },
  insightText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
});
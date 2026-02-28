import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { BarChart } from '../../components/charts/BarChart';
import { Colors, Spacing } from '../../theme';
import { MOTIVATIONAL_QUOTES, MUSCLE_COLORS, MuscleGroup } from '../../constants/exercises';
import { useWorkoutStore } from '@/src/store/workout-store';

interface HomeScreenProps {
  onNavigate?: (tab: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { workoutHistory, currentStreak, highestStreak, personalRecords, activeWorkout } =
    useWorkoutStore();

  const quote = useMemo(
    () => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
    []
  );

  const weeklyVolume = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;
    return workoutHistory
      .filter((w) => w.startTime > weekAgo)
      .reduce((sum, w) => {
        return (
          sum +
          w.exercises.reduce((eSum, e) => {
            return eSum + e.sets.reduce((sSum, s) => sSum + s.reps * s.weight, 0);
          }, 0)
        );
      }, 0);
  }, [workoutHistory]);

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((label, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const key = date.toISOString().split('T')[0];
      const dayWorkouts = workoutHistory.filter((w) => w.date === key);
      const vol = dayWorkouts.reduce((sum, w) => {
        return (
          sum +
          w.exercises.reduce(
            (es, e) => es + e.sets.reduce((ss, s) => ss + s.reps * s.weight, 0),
            0
          )
        );
      }, 0);
      return { label, value: vol / 1000 };
    });
  }, [workoutHistory]);

  const muscleDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    const weekAgo = Date.now() - 7 * 86400000;
    workoutHistory
      .filter((w) => w.startTime > weekAgo)
      .forEach((w) =>
        w.exercises.forEach((e) => {
          counts[e.muscleGroup] = (counts[e.muscleGroup] ?? 0) + 1;
        })
      );
    return counts;
  }, [workoutHistory]);

  const recentWorkouts = workoutHistory.slice(0, 3);
  const totalWorkouts = workoutHistory.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.subGreeting}>Ready to crush it?</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakNum}>{currentStreak}</Text>
        </View>
      </View>

      {/* Quote */}
      <Card style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>💬</Text>
        <Text style={styles.quoteText}>"{quote}"</Text>
      </Card>

      {/* Active Workout Banner */}
      {activeWorkout && (
        <Pressable onPress={() => onNavigate?.('log')} style={styles.activeBanner}>
          <View style={styles.activeDot} />
          <Text style={styles.activeBannerText}>Workout in progress — tap to continue</Text>
          <Text style={styles.activeBannerArrow}>›</Text>
        </Pressable>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard label="Weekly Volume" value={(weeklyVolume / 1000).toFixed(1)} unit="t" />
        <StatCard
          label="Streak"
          value={currentStreak}
          unit="days"
          accent={Colors.status.warning}
        />
        <StatCard label="Workouts" value={totalWorkouts} accent={Colors.accent.purple} />
      </View>

      {/* Weekly Volume Chart */}
      <Card style={styles.section}>
        <SectionHeader title="This Week" action="Analytics" onAction={() => onNavigate?.('analytics')} />
        <BarChart data={weeklyData} height={130} />
      </Card>

      {/* Muscle Distribution */}
      {Object.keys(muscleDistribution).length > 0 && (
        <Card style={styles.section}>
          <SectionHeader title="Muscle Focus" />
          <View style={styles.muscleGrid}>
            {Object.entries(muscleDistribution).map(([muscle, count]) => (
              <View key={muscle} style={styles.muscleItem}>
                <View
                  style={[
                    styles.muscleDot,
                    { backgroundColor: MUSCLE_COLORS[muscle as MuscleGroup] },
                  ]}
                />
                <Text style={styles.muscleName}>{muscle}</Text>
                <Text style={styles.muscleCount}>{count}x</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* PRs */}
      <Card style={styles.section}>
        <SectionHeader title="Personal Records" action="View All" />
        {Object.values(personalRecords)
          .slice(0, 3)
          .map((pr) => (
            <View key={pr.exerciseName} style={styles.prRow}>
              <Text style={styles.prName}>{pr.exerciseName}</Text>
              <View style={styles.prRight}>
                <Text style={styles.prValue}>{pr.weight}kg</Text>
                <Badge label="PR" color={Colors.status.warning} />
              </View>
            </View>
          ))}
      </Card>

      {/* Recent Workouts */}
      <View>
        <SectionHeader
          title="Recent Workouts"
          action="All"
          onAction={() => onNavigate?.('log')}
        />
        {recentWorkouts.map((w) => {
          const duration = w.endTime
            ? Math.round((w.endTime - w.startTime) / 60000)
            : null;
          const vol = w.exercises.reduce(
            (sum, e) => sum + e.sets.reduce((s2, s) => s2 + s.reps * s.weight, 0),
            0
          );
          return (
            <Card key={w.id} style={styles.workoutCard} onPress={() => {}}>
              <View style={styles.workoutRow}>
                <View>
                  <Text style={styles.workoutDate}>{w.date}</Text>
                  <Text style={styles.workoutExercises}>
                    {w.exercises.map((e) => e.name).join(' · ')}
                  </Text>
                </View>
                <View style={styles.workoutStats}>
                  {duration && <Text style={styles.workoutStat}>{duration}m</Text>}
                  <Text style={[styles.workoutStat, { color: Colors.accent.blue }]}>
                    {(vol / 1000).toFixed(1)}t
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: Colors.card.primary,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.status.warning + '44',
  },
  streakFire: {
    fontSize: 20,
  },
  streakNum: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.status.warning,
  },
  quoteCard: {
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card.secondary,
  },
  quoteIcon: {
    fontSize: 20,
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  activeBanner: {
    backgroundColor: Colors.accent.blue + '22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.accent.blue + '55',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 10,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.blue,
  },
  activeBannerText: {
    flex: 1,
    color: Colors.accent.blue,
    fontWeight: '600',
    fontSize: 14,
  },
  activeBannerArrow: {
    color: Colors.accent.blue,
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  muscleGrid: {
    gap: 8,
    marginTop: 4,
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  muscleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  muscleName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  muscleCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '700',
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  prName: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  prRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.status.warning,
  },
  workoutCard: {
    marginBottom: 8,
  },
  workoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutDate: {
    fontSize: 12,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  workoutExercises: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  workoutStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  workoutStat: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.secondary,
  },
});
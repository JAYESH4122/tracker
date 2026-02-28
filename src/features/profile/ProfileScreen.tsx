import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { useWorkoutStore } from '@/src/store/workout-store';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors, Spacing, Radius } from '../../theme';

export function ProfileScreen() {
  const { workoutHistory, personalRecords, currentStreak, highestStreak } = useWorkoutStore();

  const totalVolume = workoutHistory.reduce(
    (sum, w) =>
      sum + w.exercises.reduce((es, e) => es + e.sets.reduce((ss, s) => ss + s.reps * s.weight, 0), 0),
    0
  );

  const totalSets = workoutHistory.reduce(
    (sum, w) => sum + w.exercises.reduce((es, e) => es + e.sets.length, 0),
    0
  );

  const avgDuration = (() => {
    const withDuration = workoutHistory.filter((w) => w.endTime);
    if (!withDuration.length) return 0;
    return Math.round(
      withDuration.reduce((sum, w) => sum + (w.endTime! - w.startTime) / 60000, 0) /
        withDuration.length
    );
  })();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Hero */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>💪</Text>
        </View>
        <Text style={styles.name}>Elite Athlete</Text>
        <Text style={styles.since}>Training since 2024</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Workouts" value={workoutHistory.length} />
        <StatCard label="Streak" value={currentStreak} unit="d" accent={Colors.status.warning} />
        <StatCard label="Volume" value={(totalVolume / 1000).toFixed(0)} unit="t" accent={Colors.accent.purple} />
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Total Sets" value={totalSets} accent={Colors.status.success} />
        <StatCard label="Avg Session" value={avgDuration} unit="min" />
        <StatCard label="Best Streak" value={highestStreak} unit="d" accent={Colors.status.warning} />
      </View>

      {/* PRs */}
      <Card style={styles.section}>
        <SectionHeader title="Personal Records" />
        {Object.values(personalRecords).map((pr) => (
          <View key={pr.exerciseName} style={styles.prRow}>
            <View style={styles.prLeft}>
              <Text style={styles.prIcon}>🏆</Text>
              <View>
                <Text style={styles.prName}>{pr.exerciseName}</Text>
                <Text style={styles.prDate}>{pr.date}</Text>
              </View>
            </View>
            <Text style={styles.prWeight}>{pr.weight}kg</Text>
          </View>
        ))}
      </Card>

      {/* Settings-style options */}
      <Card style={styles.section}>
        <SectionHeader title="Preferences" />
        {[
          { icon: '⚖️', label: 'Weight Unit', value: 'kg' },
          { icon: '📏', label: 'Distance Unit', value: 'km' },
          { icon: '⏱', label: 'Default Rest Timer', value: '90s' },
          { icon: '🌙', label: 'Theme', value: 'Matte Black' },
        ].map((item) => (
          <Pressable key={item.label} style={styles.settingRow}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
            <Text style={styles.settingChevron}>›</Text>
          </Pressable>
        ))}
      </Card>

      {/* About */}
      <Card style={styles.section}>
        <View style={styles.aboutRow}>
          <Text style={styles.appName}>GymApp</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
        <Text style={styles.aboutTagline}>Built for elite athletes.</Text>
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
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.card.secondary,
    borderWidth: 2,
    borderColor: Colors.accent.blue + '55',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  since: {
    fontSize: 13,
    color: Colors.text.muted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  section: {
    marginBottom: Spacing.md,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  prLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prIcon: {
    fontSize: 18,
  },
  prName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  prDate: {
    fontSize: 11,
    color: Colors.text.muted,
    marginTop: 2,
  },
  prWeight: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.status.warning,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
    gap: 12,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  settingChevron: {
    fontSize: 18,
    color: Colors.text.muted,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  version: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '600',
  },
  aboutTagline: {
    fontSize: 13,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
});
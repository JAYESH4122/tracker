import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  PremiumCard,
  PremiumDivider,
  PremiumHeader,
  PremiumMetricTile,
  PremiumScrollScreen,
} from "@/components";
import { useHistoryStore } from "@/store/use-history-store";
import { formatDateLabel, formatDuration, groupWorkoutsByDate } from "@/utils/workout";

export function HistoryScreen() {
  const router = useRouter();
  const workouts = useHistoryStore((state) => state.workouts);
  const groupedWorkouts = useMemo(() => groupWorkoutsByDate(workouts), [workouts]);
  const sortedWorkouts = useMemo(
    () => [...workouts].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    [workouts],
  );

  const compactNumber = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [],
  );

  const totalVolume = workouts.reduce((sum, workout) => sum + workout.totalVolume, 0);
  const totalMinutes = Math.round(
    workouts.reduce((sum, workout) => sum + workout.durationSeconds, 0) / 60,
  );
  const prCount = workouts.reduce(
    (sum, workout) => sum + workout.exercises.filter((exercise) => exercise.newPr).length,
    0,
  );
  const latestWorkout = sortedWorkouts[0] ?? null;

  return (
    <PremiumScrollScreen>
      <PremiumHeader title="History" leftIcon="menu" onLeftPress={() => {}} />

      <PremiumCard accent style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="history" size={24} color="#D4AF37" />
          </View>
          <View style={styles.heroCopy}>
            <AppText variant="caption" color="primary" style={styles.eyebrow}>
              Training Log
            </AppText>
            <AppText variant="display" style={styles.heroTitle}>
              Workout History
            </AppText>
            <AppText variant="body" color="subtext" style={styles.heroSub}>
              Completed sessions, PR markers, volume, and time grouped into a clean timeline.
            </AppText>
          </View>
        </View>
        {latestWorkout ? (
          <View style={styles.latestStrip}>
            <View>
              <AppText variant="caption" color="subtext" style={styles.stripLabel}>
                Latest session
              </AppText>
              <AppText variant="sectionTitle">{latestWorkout.name}</AppText>
            </View>
            <AppText variant="caption" color="primary" style={styles.stripDate}>
              {formatDateLabel(latestWorkout.date)}
            </AppText>
          </View>
        ) : null}
      </PremiumCard>

      <View style={styles.metricsGrid}>
        <PremiumMetricTile
          icon="fitness-center"
          label="Sessions"
          value={String(workouts.length).padStart(2, "0")}
          style={styles.metricTile}
        />
        <PremiumMetricTile
          icon="analytics"
          label="Volume"
          value={`${compactNumber.format(totalVolume)}kg`}
          accent
          style={styles.metricTile}
        />
        <PremiumMetricTile
          icon="timer"
          label="Time"
          value={`${compactNumber.format(totalMinutes)}m`}
          style={styles.metricTile}
        />
        <PremiumMetricTile
          icon="emoji-events"
          label="PRs"
          value={String(prCount).padStart(2, "0")}
          style={styles.metricTile}
        />
      </View>

      <PremiumDivider />

      <View style={styles.sectionHeader}>
        <AppText variant="caption" color="primary" style={styles.eyebrow}>
          Timeline
        </AppText>
        <AppText variant="title">Saved Sessions</AppText>
      </View>

      {groupedWorkouts.length > 0 ? (
        <View style={styles.timeline}>
          <View style={styles.timelineLine} />
          {groupedWorkouts.map((group) => (
            <View key={group.date} style={styles.group}>
              <View style={styles.dateRow}>
                <View style={styles.dateDot} />
                <AppText variant="caption" color="subtext" style={styles.dateLabel}>
                  {formatDateLabel(group.date)}
                </AppText>
              </View>

              <View style={styles.sessionList}>
                {group.workouts.map((workout) => {
                  const newPrs = workout.exercises.filter((exercise) => exercise.newPr).length;

                  return (
                    <PremiumCard
                      key={workout.id}
                      onPress={() => router.push(`/history/${workout.id}`)}
                      style={styles.workoutCard}
                    >
                      <View style={styles.workoutTop}>
                        <View style={styles.workoutTitleBlock}>
                          <AppText variant="sectionTitle" style={styles.workoutTitle}>
                            {workout.name}
                          </AppText>
                          <AppText variant="caption" color="subtext" style={styles.workoutMeta}>
                            {workout.exerciseCount} exercises / {workout.setCount} sets
                          </AppText>
                        </View>
                        <MaterialIcons name="chevron-right" size={22} color="#D4AF37" />
                      </View>

                      <View style={styles.workoutStats}>
                        <View style={styles.workoutStat}>
                          <AppText variant="caption" color="subtext" style={styles.statLabel}>
                            Volume
                          </AppText>
                          <AppText variant="statValue">
                            {workout.totalVolume.toLocaleString()} kg
                          </AppText>
                        </View>
                        <View style={styles.workoutStat}>
                          <AppText variant="caption" color="subtext" style={styles.statLabel}>
                            Duration
                          </AppText>
                          <AppText variant="statValue">
                            {formatDuration(workout.durationSeconds)}
                          </AppText>
                        </View>
                        {newPrs > 0 ? (
                          <View style={styles.prBadge}>
                            <AppText variant="caption" color="primary" style={styles.prText}>
                              {newPrs} PR
                            </AppText>
                          </View>
                        ) : null}
                      </View>
                    </PremiumCard>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <PremiumCard style={styles.emptyCard}>
          <MaterialIcons name="fitness-center" size={34} color="#D4AF37" />
          <AppText variant="sectionTitle" style={styles.emptyTitle}>
            No workouts saved yet
          </AppText>
          <AppText variant="body" color="subtext" style={styles.emptyText}>
            Finish a workout session and it will appear here grouped by date.
          </AppText>
        </PremiumCard>
      )}
    </PremiumScrollScreen>
  );
}

const styles = StyleSheet.create({
  headerBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.26)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  headerBadgeText: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    lineHeight: 16,
  },
  heroCard: {
    gap: 16,
  },
  heroTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.22)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  eyebrow: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#D4AF37",
    fontSize: 32,
    lineHeight: 36,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 21,
  },
  latestStrip: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  stripLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  stripDate: {
    fontFamily: "Anta_400Regular",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "right",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricTile: {
    flexBasis: "47%",
    flexGrow: 1,
    flexShrink: 0,
  },
  sectionHeader: {
    gap: 4,
  },
  timeline: {
    position: "relative",
    paddingLeft: 24,
    gap: 24,
  },
  timelineLine: {
    position: "absolute",
    left: 7,
    top: 12,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(212, 175, 55, 0.18)",
  },
  group: {
    gap: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: -24,
  },
  dateDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#0F0F0F",
    backgroundColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  dateLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sessionList: {
    gap: 12,
  },
  workoutCard: {
    padding: 16,
    gap: 14,
  },
  workoutTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  workoutTitleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  workoutTitle: {
    color: "#E5E2E1",
    textTransform: "uppercase",
  },
  workoutMeta: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  workoutStats: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
    flexWrap: "wrap",
  },
  workoutStat: {
    minWidth: 90,
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  prBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.25)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  prText: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  emptyCard: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 34,
  },
  emptyTitle: {
    textAlign: "center",
    textTransform: "uppercase",
  },
  emptyText: {
    textAlign: "center",
    maxWidth: 300,
  },
});

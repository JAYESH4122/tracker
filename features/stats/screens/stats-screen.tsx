import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppText, Card } from "@/components";
import { useHistoryStore } from "@/store/use-history-store";
import { useStatsStore } from "@/store/use-stats-store";
import { theme } from "@/theme";
import { toIsoDate } from "@/utils/workout";

type DayPoint = {
  key: string;
  label: string;
  volume: number;
  workouts: number;
};

export function StatsScreen() {
  const workouts = useHistoryStore((state) => state.workouts);
  const summary = useStatsStore.getState().getSummary();
  const prs = useStatsStore.getState().computePRs(workouts).slice(0, 4);

  const weekSeries = useMemo<DayPoint[]>(() => {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));

      const key = toIsoDate(date);
      const dayWorkouts = workouts.filter((workout) => workout.date === key);

      return {
        key,
        label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
        volume: dayWorkouts.reduce((sum, workout) => sum + workout.totalVolume, 0),
        workouts: dayWorkouts.length,
      };
    });
  }, [workouts]);

  const maxVolume = Math.max(...weekSeries.map((point) => point.volume), 1);
  const maxWorkouts = Math.max(...weekSeries.map((point) => point.workouts), 1);
  const compactNumber = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <AppText variant="caption" color="subtext">
          Performance
        </AppText>
        <AppText variant="display">Stats</AppText>
        <AppText variant="body" color="subtext">
          A minimal snapshot of training volume, weekly consistency, and your strongest lifts.
        </AppText>
      </View>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <AppText variant="caption" color="subtext">
            Total volume
          </AppText>
          <AppText variant="statValue">{compactNumber.format(summary.totalVolume)} kg</AppText>
        </Card>
        <Card style={styles.summaryCard}>
          <AppText variant="caption" color="subtext">
            Workouts/week
          </AppText>
          <AppText variant="statValue">{summary.weeklyWorkouts}</AppText>
        </Card>
      </View>

      <Card elevated style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <View>
            <AppText variant="sectionTitle">Weekly volume</AppText>
            <AppText variant="caption" color="subtext">
              Last 7 days
            </AppText>
          </View>
          <AppText variant="caption" color="subtext">
            {compactNumber.format(summary.totalVolume)} kg total
          </AppText>
        </View>

        <View style={styles.chart}>
          {weekSeries.map((point) => {
            const height = Math.max(8, (point.volume / maxVolume) * 100);

            return (
              <View key={point.key} style={styles.barColumn}>
                <AppText variant="caption" color="subtext" style={styles.barValue}>
                  {point.volume > 0 ? compactNumber.format(point.volume) : ""}
                </AppText>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${height}%` }]} />
                </View>
                <AppText variant="caption" color="subtext">
                  {point.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <View>
            <AppText variant="sectionTitle">Workouts per day</AppText>
            <AppText variant="caption" color="subtext">
              Consistency over the same 7-day window
            </AppText>
          </View>
          <AppText variant="caption" color="subtext">
            {summary.weeklyWorkouts} this week
          </AppText>
        </View>

        <View style={styles.chart}>
          {weekSeries.map((point) => {
            const height = Math.max(8, (point.workouts / maxWorkouts) * 100);

            return (
              <View key={`${point.key}-workouts`} style={styles.barColumn}>
                <AppText variant="caption" color="subtext" style={styles.barValue}>
                  {point.workouts > 0 ? point.workouts : ""}
                </AppText>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, styles.workoutFill, { height: `${height}%` }]} />
                </View>
                <AppText variant="caption" color="subtext">
                  {point.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={styles.prCard}>
        <View style={styles.cardHeader}>
          <View>
            <AppText variant="sectionTitle">PR highlights</AppText>
            <AppText variant="caption" color="subtext">
              Strongest lifts on record
            </AppText>
          </View>
        </View>

        <View style={styles.prList}>
          {prs.length > 0 ? (
            prs.map((pr) => (
              <View key={pr.exerciseId} style={styles.prRow}>
                <View style={styles.prCopy}>
                  <AppText variant="body">{pr.exerciseName}</AppText>
                  <AppText variant="caption" color="subtext">
                    {pr.muscleGroup}
                  </AppText>
                </View>
                <View style={styles.prValue}>
                  <AppText variant="sectionTitle">{pr.maxWeight} kg</AppText>
                  <AppText variant="caption" color="subtext">
                    {pr.workoutDate}
                  </AppText>
                </View>
              </View>
            ))
          ) : (
            <AppText variant="body" color="subtext">
              PRs will appear once you save workouts with loaded weights.
            </AppText>
          )}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 180,
    gap: theme.spacing.lg,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
  },
  header: {
    gap: theme.spacing.xs,
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  summaryCard: {
    flex: 1,
    gap: 6,
    padding: theme.spacing.md,
  },
  chartCard: {
    gap: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    minHeight: 190,
    paddingTop: theme.spacing.sm,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    minWidth: 0,
  },
  barValue: {
    minHeight: 18,
  },
  barTrack: {
    width: "100%",
    height: 126,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
  },
  workoutFill: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  prCard: {
    gap: theme.spacing.md,
  },
  prList: {
    gap: theme.spacing.sm,
  },
  prRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  prCopy: {
    flex: 1,
    gap: 4,
  },
  prValue: {
    alignItems: "flex-end",
  },
});

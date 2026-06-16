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
import { useStatsStore } from "@/store/use-stats-store";
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
    <PremiumScrollScreen>
      <PremiumHeader title="Stats" leftIcon="menu" onLeftPress={() => {}} />

      <PremiumCard accent style={styles.heroCard}>
        <AppText variant="caption" color="primary" style={styles.eyebrow}>
          Performance
        </AppText>
        <AppText variant="display" style={styles.heroTitle}>
          Stats
        </AppText>
        <AppText variant="body" color="subtext" style={styles.heroSub}>
          Training volume, weekly consistency, and strongest lifts in one dashboard view.
        </AppText>
      </PremiumCard>

      <View style={styles.summaryGrid}>
        <PremiumMetricTile
          icon="analytics"
          label="Total volume"
          value={`${compactNumber.format(summary.totalVolume)}kg`}
          accent
          style={styles.summaryTile}
        />
        <PremiumMetricTile
          icon="calendar-month"
          label="Workouts/week"
          value={String(summary.weeklyWorkouts)}
          style={styles.summaryTile}
        />
        <PremiumMetricTile
          icon="fitness-center"
          label="Total workouts"
          value={String(summary.totalWorkouts)}
          style={styles.summaryTile}
        />
        <PremiumMetricTile
          icon="emoji-events"
          label="PR highlights"
          value={String(prs.length).padStart(2, "0")}
          style={styles.summaryTile}
        />
      </View>

      <PremiumDivider />

      <PremiumCard accent style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderCopy}>
            <AppText variant="caption" color="primary" style={styles.eyebrow}>
              Last 7 days
            </AppText>
            <AppText variant="sectionTitle">Weekly Volume</AppText>
          </View>
          <AppText variant="caption" color="subtext" style={styles.headerMeta}>
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
                <AppText variant="caption" color="subtext" style={styles.barLabel}>
                  {point.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </PremiumCard>

      <PremiumCard style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderCopy}>
            <AppText variant="caption" color="primary" style={styles.eyebrow}>
              Consistency
            </AppText>
            <AppText variant="sectionTitle">Workouts Per Day</AppText>
          </View>
          <AppText variant="caption" color="subtext" style={styles.headerMeta}>
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
                <AppText variant="caption" color="subtext" style={styles.barLabel}>
                  {point.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </PremiumCard>

      <PremiumCard style={styles.prCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderCopy}>
            <AppText variant="caption" color="primary" style={styles.eyebrow}>
              Strength
            </AppText>
            <AppText variant="sectionTitle">PR Highlights</AppText>
          </View>
        </View>

        <View style={styles.prList}>
          {prs.length > 0 ? (
            prs.map((pr) => (
              <View key={pr.exerciseId} style={styles.prRow}>
                <View style={styles.prCopy}>
                  <AppText variant="body" style={styles.prName}>
                    {pr.exerciseName}
                  </AppText>
                  <AppText variant="caption" color="subtext" style={styles.prMeta}>
                    {pr.muscleGroup}
                  </AppText>
                </View>
                <View style={styles.prValue}>
                  <AppText variant="sectionTitle" color="primary">
                    {pr.maxWeight} kg
                  </AppText>
                  <AppText variant="caption" color="subtext" style={styles.prDate}>
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
      </PremiumCard>
    </PremiumScrollScreen>
  );
}

const styles = StyleSheet.create({
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.26)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBadgeText: {
    fontFamily: "Anta_400Regular",
    fontSize: 12,
    lineHeight: 14,
  },
  heroCard: {
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
    fontSize: 34,
    lineHeight: 38,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 21,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryTile: {
    flexBasis: "47%",
    flexGrow: 1,
    flexShrink: 0,
  },
  chartCard: {
    gap: 18,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  cardHeaderCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  headerMeta: {
    fontFamily: "Anta_400Regular",
    fontSize: 11,
    letterSpacing: 0.8,
    textAlign: "right",
    textTransform: "uppercase",
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    minHeight: 190,
    paddingTop: 4,
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
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
  },
  barLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  barTrack: {
    width: "100%",
    height: 126,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#D4AF37",
  },
  workoutFill: {
    backgroundColor: "rgba(229, 226, 225, 0.58)",
  },
  prCard: {
    gap: 18,
  },
  prList: {
    gap: 10,
  },
  prRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
  },
  prCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  prName: {
    textTransform: "uppercase",
  },
  prMeta: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  prValue: {
    alignItems: "flex-end",
    minWidth: 86,
  },
  prDate: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: "right",
  },
});

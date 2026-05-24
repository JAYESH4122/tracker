import { ScrollView, StyleSheet, View } from "react-native";
import { Bar, CartesianChart, Line } from "victory-native";

import {
  AppText,
  Card,
  ChartCard,
  ChartSafeView,
  ScreenContainer,
  SectionHeader,
  StatCard,
} from "@/components";
import { theme } from "@/theme";

const weeklyActivity = [
  { day: 1, label: "Mon", value: 42 },
  { day: 2, label: "Tue", value: 55 },
  { day: 3, label: "Wed", value: 48 },
  { day: 4, label: "Thu", value: 64 },
  { day: 5, label: "Fri", value: 50 },
  { day: 6, label: "Sat", value: 74 },
  { day: 7, label: "Sun", value: 68 },
];

const strengthProgress = [
  { order: 1, lift: "Bench", weight: 95 },
  { order: 2, lift: "Squat", weight: 125 },
  { order: 3, lift: "Deadlift", weight: 155 },
];

const prCards = [
  { id: "bench-pr", label: "Bench PR", value: "102.5kg", iconName: "trophy" as const },
  { id: "squat-pr", label: "Squat PR", value: "145kg", iconName: "medal" as const },
  { id: "deadlift-pr", label: "Deadlift PR", value: "182.5kg", iconName: "flash" as const },
];

const summary = [
  { id: "workouts", label: "Total Workouts", value: "128" },
  { id: "volume", label: "Total Volume", value: "248,600kg" },
  { id: "streak", label: "Current Streak", value: "14 days" },
];

export function StatsScreen() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Performance Analytics"
          subtitle="Clear progress across your training"
        />

        <ChartCard title="Weekly Activity" subtitle="Session intensity">
          <ChartSafeView fallbackTitle="Weekly chart unavailable">
            <View style={styles.chartWrap}>
              <CartesianChart data={weeklyActivity} xKey="day" yKeys={["value"]}>
                {({ points }) => (
                  <Line
                    points={points.value}
                    color={theme.colors.primary}
                    strokeWidth={3}
                    curveType="monotoneX"
                  />
                )}
              </CartesianChart>
            </View>
            <View style={styles.labelsRow}>
              {weeklyActivity.map((item) => (
                <AppText key={item.day} variant="caption" color="subtext">
                  {item.label}
                </AppText>
              ))}
            </View>
          </ChartSafeView>
        </ChartCard>

        <ChartCard title="Strength Progress" subtitle="Current best working sets">
          <ChartSafeView fallbackTitle="Strength chart unavailable">
            <View style={styles.chartWrap}>
              <CartesianChart data={strengthProgress} xKey="order" yKeys={["weight"]}>
                {({ points, chartBounds }) => (
                  <Bar
                    points={points.weight}
                    chartBounds={chartBounds}
                    color={theme.colors.primary}
                    roundedCorners={{ topLeft: 6, topRight: 6 }}
                  />
                )}
              </CartesianChart>
            </View>
            <View style={styles.labelsRow}>
              {strengthProgress.map((item) => (
                <AppText key={item.order} variant="caption" color="subtext">
                  {item.lift}
                </AppText>
              ))}
            </View>
          </ChartSafeView>
        </ChartCard>

        <View style={styles.row}>
          {prCards.map((item) => (
            <StatCard
              key={item.id}
              label={item.label}
              value={item.value}
              iconName={item.iconName}
            />
          ))}
        </View>

        <Card style={styles.summaryCard}>
          <SectionHeader title="Summary" subtitle="At a glance" />
          {summary.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <AppText variant="body" color="subtext">
                {item.label}
              </AppText>
              <AppText variant="sectionTitle">{item.value}</AppText>
            </View>
          ))}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  chartWrap: {
    height: 180,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  summaryCard: {
    gap: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppText, Button, Card } from "@/components";
import { useHomeStore } from "@/store/use-home-store";
import { useHistoryStore } from "@/store/use-history-store";
import { theme } from "@/theme";
import { formatDateLabel, formatDuration, isWithinCurrentWeek } from "@/utils/workout";

export function HomeScreen() {
  const router = useRouter();
  const greeting = useHomeStore((state) => state.greeting);
  const userName = useHomeStore((state) => state.userName);
  const workouts = useHistoryStore((state) => state.workouts);

  const recentWorkout = workouts[0] ?? null;
  const weeklyWorkouts = workouts.filter((workout) => isWithinCurrentWeek(workout.date));
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, workout) => sum + workout.totalVolume, 0);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["rgba(0, 255, 136, 0.12)", "rgba(11, 11, 15, 0)"]}
        style={styles.glow}
      />

      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <AppText variant="caption" color="subtext">
            {greeting}
          </AppText>
          <AppText variant="display">{userName}</AppText>
          <AppText variant="body" color="subtext">
            Minimal logging, quick inputs, and a clean view of what matters before and during a
            session.
          </AppText>
        </View>

        <View style={styles.avatar}>
          <Ionicons name="fitness" size={22} color={theme.colors.background} />
        </View>
      </View>

      <Card elevated style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroBadge}>
            <AppText variant="caption" color="primary">
              Gym ready
            </AppText>
          </View>
          <AppText variant="sectionTitle">Training at a glance</AppText>
          <AppText variant="body" color="subtext">
            Open the workout screen, start logging, and keep the interface quiet while you train.
          </AppText>
        </View>

        <View style={styles.heroActions}>
          <Button onPress={() => router.push("/workout")}>Start Workout</Button>
          <Button variant="ghost" onPress={() => router.push("/library")}>
            Exercises
          </Button>
        </View>
      </Card>

      <Card style={styles.recentCard}>
        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="sectionTitle">Recent workout</AppText>
            <AppText variant="caption" color="subtext">
              Last session saved
            </AppText>
          </View>
          <Button variant="ghost" onPress={() => router.push("/history")}>
            History
          </Button>
        </View>

        {recentWorkout ? (
          <View style={styles.recentBody}>
            <View style={styles.recentRow}>
              <View style={styles.recentCopy}>
                <AppText variant="body">{recentWorkout.name}</AppText>
                <AppText variant="caption" color="subtext">
                  {formatDateLabel(recentWorkout.date)}
                </AppText>
              </View>
              <View style={styles.recentVolume}>
                <AppText variant="sectionTitle">
                  {recentWorkout.totalVolume.toLocaleString()}
                </AppText>
                <AppText variant="caption" color="subtext">
                  kg
                </AppText>
              </View>
            </View>

            <View style={styles.recentMeta}>
              <View style={styles.metaPill}>
                <AppText variant="caption" color="primary">
                  {recentWorkout.exerciseCount} exercises
                </AppText>
              </View>
              <View style={styles.metaPill}>
                <AppText variant="caption" color="text">
                  {recentWorkout.setCount} sets
                </AppText>
              </View>
              <View style={styles.metaPill}>
                <AppText variant="caption" color="text">
                  {formatDuration(recentWorkout.durationSeconds)}
                </AppText>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <AppText variant="body" color="subtext">
              Your saved workouts will appear here once you finish a session.
            </AppText>
          </View>
        )}
      </Card>

      <Card style={styles.statsCard}>
        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="sectionTitle">Weekly stats</AppText>
            <AppText variant="caption" color="subtext">
              Very small, very readable
            </AppText>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <AppText variant="sectionTitle">{weeklyWorkouts.length}</AppText>
            <AppText variant="caption" color="subtext">
              workouts
            </AppText>
          </View>
          <View style={styles.statCell}>
            <AppText variant="sectionTitle">{totalWorkouts}</AppText>
            <AppText variant="caption" color="subtext">
              total
            </AppText>
          </View>
          <View style={styles.statCell}>
            <AppText variant="sectionTitle">{totalVolume.toLocaleString()}</AppText>
            <AppText variant="caption" color="subtext">
              kg volume
            </AppText>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
  },
  glow: {
    position: "absolute",
    right: -80,
    top: -120,
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  heroCard: {
    gap: theme.spacing.lg,
  },
  heroTop: {
    gap: theme.spacing.sm,
  },
  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(0, 255, 136, 0.08)",
  },
  heroActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  recentCard: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  recentBody: {
    gap: theme.spacing.md,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  recentCopy: {
    flex: 1,
    gap: 4,
  },
  recentVolume: {
    alignItems: "flex-end",
  },
  recentMeta: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyState: {
    paddingVertical: theme.spacing.sm,
  },
  statsCard: {
    gap: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCell: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
});

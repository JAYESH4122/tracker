import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { AppText, Card, SectionHeader } from "@/components";
import { useHistoryStore } from "@/store/use-history-store";
import { theme } from "@/theme";
import { formatDateLabel, formatDuration, groupWorkoutsByDate } from "@/utils/workout";

export function HistoryScreen() {
  const router = useRouter();
  const workouts = useHistoryStore((state) => state.workouts);
  const groupedWorkouts = useMemo(() => groupWorkoutsByDate(workouts), [workouts]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Workout History" subtitle="Completed sessions grouped by date" />

      {groupedWorkouts.length > 0 ? (
        groupedWorkouts.map((group) => (
          <View key={group.date} style={styles.group}>
            <AppText variant="caption" color="subtext" style={styles.dateLabel}>
              {formatDateLabel(group.date)}
            </AppText>
            <View style={styles.groupList}>
              {group.workouts.map((workout) => {
                const newPrs = workout.exercises.filter((exercise) => exercise.newPr).length;
                return (
                  <Pressable
                    key={workout.id}
                    onPress={() => router.push(`/history/${workout.id}`)}
                    style={({ pressed }) => [pressed && styles.pressed]}
                  >
                    <Card style={styles.card}>
                      <View style={styles.row}>
                        <View style={styles.left}>
                          <View style={styles.iconWrap}>
                            <Ionicons name="barbell" size={16} color={theme.colors.primary} />
                          </View>
                          <View style={styles.copy}>
                            <AppText variant="sectionTitle">{workout.name}</AppText>
                            <AppText variant="caption" color="subtext">
                              {workout.exerciseCount} exercises • {workout.setCount} sets
                            </AppText>
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.subtext} />
                      </View>

                      <View style={styles.metaRow}>
                        <AppText variant="caption" color="subtext">
                          {formatDuration(workout.durationSeconds)}
                        </AppText>
                        <AppText variant="caption" color="subtext">
                          {workout.totalVolume.toLocaleString()} kg
                        </AppText>
                        {newPrs > 0 ? (
                          <View style={styles.prBadge}>
                            <AppText variant="caption" color="primary">
                              New PR 🎉
                            </AppText>
                          </View>
                        ) : null}
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))
      ) : (
        <Card>
          <AppText variant="sectionTitle">No workouts saved yet</AppText>
          <AppText variant="body" color="subtext">
            Finish a workout session and it will appear here grouped by date.
          </AppText>
        </Card>
      )}
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
  group: {
    gap: theme.spacing.sm,
  },
  dateLabel: {
    paddingHorizontal: theme.spacing.xs,
  },
  groupList: {
    gap: theme.spacing.sm,
  },
  card: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryMuted,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  prBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(0, 255, 136, 0.08)",
  },
  pressed: {
    opacity: 0.92,
  },
});

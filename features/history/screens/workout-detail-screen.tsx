import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppText, Button, Card, SectionHeader } from "@/components";
import { useHistoryStore } from "@/store/use-history-store";
import { theme } from "@/theme";
import { formatDateLabel, formatDuration } from "@/utils/workout";

export function WorkoutDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ workoutId?: string }>();
  const workoutId = params.workoutId ?? "";
  const workout = useHistoryStore((state) => state.workouts.find((item) => item.id === workoutId));

  if (!workout) {
    return (
      <View style={styles.empty}>
        <AppText variant="sectionTitle">Workout not found</AppText>
        <Button onPress={() => router.back()}>Go back</Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <AppText variant="caption" color="subtext">
            Saved workout
          </AppText>
          <AppText variant="display">{workout.name}</AppText>
          <AppText variant="body" color="subtext">
            {formatDateLabel(workout.date)} • {formatDuration(workout.durationSeconds)}
          </AppText>
        </View>
        <Button variant="ghost" onPress={() => router.back()}>
          Back
        </Button>
      </View>

      <Card elevated>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <AppText variant="caption" color="subtext">
              Exercises
            </AppText>
            <AppText variant="sectionTitle">{workout.exerciseCount}</AppText>
          </View>
          <View style={styles.metric}>
            <AppText variant="caption" color="subtext">
              Sets
            </AppText>
            <AppText variant="sectionTitle">{workout.setCount}</AppText>
          </View>
          <View style={styles.metric}>
            <AppText variant="caption" color="subtext">
              Volume
            </AppText>
            <AppText variant="sectionTitle">{workout.totalVolume.toLocaleString()} kg</AppText>
          </View>
        </View>
      </Card>

      <View style={styles.exerciseList}>
        {workout.exercises.map((exercise) => (
          <Card key={exercise.id}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseTitle}>
                <AppText variant="sectionTitle">{exercise.exerciseName}</AppText>
                <AppText variant="caption" color="subtext">
                  {exercise.muscleGroup}
                </AppText>
              </View>
              <View style={styles.badges}>
                {exercise.newPr ? (
                  <View style={styles.prBadge}>
                    <AppText variant="caption" color="primary">
                      New PR 🎉
                    </AppText>
                  </View>
                ) : null}
                <Button
                  variant="ghost"
                  onPress={() => router.push(`/exercise/${exercise.exerciseId}`)}
                >
                  Video
                </Button>
              </View>
            </View>

            <View style={styles.setList}>
              {exercise.sets.map((setItem, index) => (
                <View key={setItem.id} style={styles.setRow}>
                  <View style={styles.setMeta}>
                    <Ionicons
                      name={setItem.isCompleted ? "checkmark-circle" : "ellipse-outline"}
                      size={18}
                      color={setItem.isCompleted ? theme.colors.primary : theme.colors.subtext}
                    />
                    <AppText variant="caption" color="subtext">
                      Set {index + 1}
                    </AppText>
                  </View>
                  <AppText variant="body">
                    {setItem.reps ?? "-"} reps • {setItem.weight ?? "-"} kg
                  </AppText>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>

      <Card>
        <SectionHeader title="Summary" subtitle="Saved workout snapshot" />
        <View style={styles.summaryRow}>
          <AppText variant="body" color="subtext">
            Started
          </AppText>
          <AppText variant="body">{workout.startedAt}</AppText>
        </View>
        <View style={styles.summaryRow}>
          <AppText variant="body" color="subtext">
            Ended
          </AppText>
          <AppText variant="body">{workout.endedAt}</AppText>
        </View>
        <View style={styles.summaryRow}>
          <AppText variant="body" color="subtext">
            Notes
          </AppText>
          <AppText variant="body">{workout.notes ?? "No notes saved"}</AppText>
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
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  metric: {
    flex: 1,
    minWidth: 100,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.cardElevated,
  },
  exerciseList: {
    gap: theme.spacing.sm,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  exerciseTitle: {
    flex: 1,
    gap: 4,
  },
  badges: {
    alignItems: "flex-end",
    gap: theme.spacing.xs,
  },
  prBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(0, 255, 136, 0.08)",
  },
  setList: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.cardElevated,
  },
  setMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
});

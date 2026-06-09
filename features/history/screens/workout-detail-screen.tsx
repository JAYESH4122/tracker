import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import {
  AppText,
  PremiumCard,
  PremiumDivider,
  PremiumHeader,
  PremiumMetricTile,
  PremiumPrimaryAction,
  PremiumScrollScreen,
} from "@/components";
import { useHistoryStore } from "@/store/use-history-store";
import { formatDateLabel, formatDuration } from "@/utils/workout";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function WorkoutDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ workoutId?: string }>();
  const workoutId = params.workoutId ?? "";
  const workout = useHistoryStore((state) => state.workouts.find((item) => item.id === workoutId));

  if (!workout) {
    return (
      <PremiumScrollScreen reserveBottomDock={false}>
        <PremiumHeader title="Workout" leftIcon="chevron-left" onLeftPress={() => router.back()} />
        <PremiumCard style={styles.emptyCard}>
          <MaterialIcons name="error-outline" size={36} color="#D4AF37" />
          <AppText variant="sectionTitle" style={styles.emptyTitle}>
            Workout not found
          </AppText>
          <AppText variant="body" color="subtext" style={styles.emptyText}>
            The selected saved session could not be loaded.
          </AppText>
          <PremiumPrimaryAction icon="arrow-back" onPress={() => router.back()}>
            Go Back
          </PremiumPrimaryAction>
        </PremiumCard>
      </PremiumScrollScreen>
    );
  }

  return (
    <PremiumScrollScreen bottomInset={72} reserveBottomDock={false}>
      <PremiumHeader title="Workout" leftIcon="chevron-left" onLeftPress={() => router.back()} />

      <PremiumCard accent style={styles.heroCard}>
        <AppText variant="caption" color="primary" style={styles.eyebrow}>
          Saved Workout
        </AppText>
        <AppText variant="display" style={styles.heroTitle}>
          {workout.name}
        </AppText>
        <AppText variant="body" color="subtext" style={styles.heroSub}>
          {formatDateLabel(workout.date)} / {formatDuration(workout.durationSeconds)}
        </AppText>
      </PremiumCard>

      <View style={styles.metrics}>
        <PremiumMetricTile
          icon="fitness-center"
          label="Exercises"
          value={String(workout.exerciseCount)}
          style={styles.metricTile}
        />
        <PremiumMetricTile
          icon="reorder"
          label="Sets"
          value={String(workout.setCount)}
          style={styles.metricTile}
        />
        <PremiumMetricTile
          icon="analytics"
          label="Volume"
          value={`${workout.totalVolume.toLocaleString()}kg`}
          accent
          style={styles.metricTile}
        />
      </View>

      <PremiumDivider />

      <View style={styles.sectionHeader}>
        <AppText variant="caption" color="primary" style={styles.eyebrow}>
          Exercise Log
        </AppText>
        <AppText variant="title">Completed Movements</AppText>
      </View>

      <View style={styles.exerciseList}>
        {workout.exercises.map((exercise) => (
          <PremiumCard key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseTitle}>
                <AppText variant="sectionTitle" style={styles.exerciseName}>
                  {exercise.exerciseName}
                </AppText>
                <AppText variant="caption" color="subtext" style={styles.exerciseMeta}>
                  {exercise.muscleGroup}
                </AppText>
              </View>
              <View style={styles.badges}>
                {exercise.newPr ? (
                  <View style={styles.prBadge}>
                    <AppText variant="caption" color="primary" style={styles.prText}>
                      New PR
                    </AppText>
                  </View>
                ) : null}
                <Pressable
                  onPress={() => router.push(`/exercise/${exercise.exerciseId}`)}
                  style={({ pressed }) => [styles.videoPill, pressed ? styles.pressed : null]}
                >
                  <MaterialIcons name="smart-display" size={15} color="#D4AF37" />
                  <AppText variant="caption" color="primary" style={styles.videoText}>
                    Video
                  </AppText>
                </Pressable>
              </View>
            </View>

            <View style={styles.setList}>
              {exercise.sets.map((setItem, index) => (
                <View key={setItem.id} style={styles.setRow}>
                  <View style={styles.setMeta}>
                    <MaterialIcons
                      name={setItem.isCompleted ? "check-circle" : "radio-button-unchecked"}
                      size={18}
                      color={setItem.isCompleted ? "#D4AF37" : "rgba(160, 160, 160, 0.8)"}
                    />
                    <AppText variant="caption" color="subtext" style={styles.setLabel}>
                      Set {index + 1}
                    </AppText>
                  </View>
                  <AppText variant="body" style={styles.setValue}>
                    {setItem.reps ?? "-"} reps / {setItem.weight ?? "-"} kg
                  </AppText>
                </View>
              ))}
            </View>
          </PremiumCard>
        ))}
      </View>

      <PremiumCard style={styles.summaryCard}>
        <View style={styles.sectionHeader}>
          <AppText variant="caption" color="primary" style={styles.eyebrow}>
            Summary
          </AppText>
          <AppText variant="title">Saved Snapshot</AppText>
        </View>
        <View style={styles.summaryRows}>
          <View style={styles.summaryRow}>
            <AppText variant="body" color="subtext">
              Started
            </AppText>
            <AppText variant="body" style={styles.summaryValue}>
              {formatDateTime(workout.startedAt)}
            </AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText variant="body" color="subtext">
              Ended
            </AppText>
            <AppText variant="body" style={styles.summaryValue}>
              {formatDateTime(workout.endedAt)}
            </AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText variant="body" color="subtext">
              Notes
            </AppText>
            <AppText variant="body" style={styles.summaryValue}>
              {workout.notes ?? "No notes saved"}
            </AppText>
          </View>
        </View>
      </PremiumCard>
    </PremiumScrollScreen>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 32,
    lineHeight: 36,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 21,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricTile: {
    width: "31%",
    minWidth: 132,
    flexGrow: 1,
  },
  sectionHeader: {
    gap: 4,
  },
  exerciseList: {
    gap: 14,
  },
  exerciseCard: {
    gap: 14,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  exerciseTitle: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  exerciseName: {
    textTransform: "uppercase",
  },
  exerciseMeta: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  badges: {
    alignItems: "flex-end",
    gap: 8,
  },
  prBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.26)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
  },
  prText: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  videoPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    backgroundColor: "rgba(212, 175, 55, 0.06)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  videoText: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
  setList: {
    gap: 8,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
  },
  setMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  setLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  setValue: {
    flexShrink: 1,
    textAlign: "right",
  },
  summaryCard: {
    gap: 16,
  },
  summaryRows: {
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    padding: 12,
  },
  summaryValue: {
    flex: 1,
    textAlign: "right",
  },
  emptyCard: {
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    textAlign: "center",
    textTransform: "uppercase",
  },
  emptyText: {
    textAlign: "center",
  },
});

import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { AppText, Button, Card } from "@/components";
import { useExerciseStore } from "@/store/use-exercise-store";
import { useHistoryStore } from "@/store/use-history-store";
import { useWorkoutStore } from "@/store/use-workout-store";
import { theme } from "@/theme";
import {
  formatDateLabel,
  formatWorkoutValue,
  getExerciseRecentPerformance,
  getYouTubeThumbnailUrl,
} from "@/utils/workout";

export function ExerciseDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ exerciseId?: string }>();
  const exerciseId = params.exerciseId ?? "";
  const exercise = useExerciseStore((state) => state.getExerciseById(exerciseId));
  const workouts = useHistoryStore((state) => state.workouts);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const addExercise = useWorkoutStore((state) => state.addExercise);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);

  if (!exercise) {
    return (
      <View style={styles.empty}>
        <AppText variant="sectionTitle">Exercise not found</AppText>
        <Button onPress={() => router.back()}>Go back</Button>
      </View>
    );
  }

  const thumbnailUrl = getYouTubeThumbnailUrl(exercise.youtubeUrl);
  const performance = getExerciseRecentPerformance(workouts, exercise.id, 3);

  const handleAddToWorkout = () => {
    if (!activeWorkout) {
      startWorkout("Strength Session");
    }
    addExercise(exercise.id);
    router.push("/workout");
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>

        <View style={styles.titleBlock}>
          <AppText variant="caption" color="subtext">
            Exercise detail
          </AppText>
          <AppText variant="display">{exercise.name}</AppText>
          <AppText variant="body" color="subtext">
            {exercise.muscleGroup}
          </AppText>
        </View>
      </View>

      <Card elevated style={styles.heroCard}>
        <View style={styles.heroMedia}>
          {thumbnailUrl ? (
            <Image source={{ uri: thumbnailUrl }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroFallback}>
              <Ionicons name="barbell" size={32} color={theme.colors.primary} />
            </View>
          )}

          <Pressable style={styles.playButton} onPress={() => Linking.openURL(exercise.youtubeUrl)}>
            <Ionicons name="play" size={18} color={theme.colors.background} />
          </Pressable>
        </View>

        <View style={styles.heroMeta}>
          <View style={styles.metaPill}>
            <AppText variant="caption" color="primary">
              {exercise.isCustom ? "Custom" : "Preset"}
            </AppText>
          </View>
          <View style={styles.metaPillSecondary}>
            <AppText variant="caption" color="text">
              {exercise.muscleGroup}
            </AppText>
          </View>
        </View>
      </Card>

      <View style={styles.actionRow}>
        <Button onPress={() => Linking.openURL(exercise.youtubeUrl)}>Open video</Button>
        <Button variant="ghost" onPress={handleAddToWorkout}>
          Add to workout
        </Button>
      </View>

      <Card style={styles.performanceCard}>
        <View style={styles.cardHeader}>
          <View>
            <AppText variant="sectionTitle">Past performance</AppText>
            <AppText variant="caption" color="subtext">
              Last logged top sets
            </AppText>
          </View>
        </View>

        <View style={styles.performanceList}>
          {performance.length > 0 ? (
            performance.map((entry) => (
              <View key={entry.workoutId} style={styles.performanceRow}>
                <View style={styles.performanceCopy}>
                  <AppText variant="body">{formatDateLabel(entry.workoutDate)}</AppText>
                  <AppText variant="caption" color="subtext">
                    Most recent peak set
                  </AppText>
                </View>
                <View style={styles.performanceValue}>
                  <AppText variant="sectionTitle">{formatWorkoutValue(entry.maxWeight)} kg</AppText>
                  <AppText variant="caption" color="subtext">
                    {entry.reps !== null ? `${formatWorkoutValue(entry.reps)} reps` : "Load only"}
                  </AppText>
                </View>
              </View>
            ))
          ) : (
            <AppText variant="body" color="subtext">
              No saved workouts yet for this movement. Log a session to surface past weights here.
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
    gap: theme.spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  titleBlock: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  heroCard: {
    gap: theme.spacing.md,
  },
  heroMedia: {
    height: 220,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    position: "absolute",
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  heroMeta: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(0, 255, 136, 0.08)",
  },
  metaPillSecondary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  performanceCard: {
    gap: theme.spacing.md,
  },
  cardHeader: {
    gap: 2,
  },
  performanceList: {
    gap: theme.spacing.sm,
  },
  performanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  performanceCopy: {
    flex: 1,
    gap: 4,
  },
  performanceValue: {
    alignItems: "flex-end",
  },
});

import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";

import { AppText, Button, Card, ExerciseCard, SectionHeader } from "@/components";
import { MUSCLE_GROUPS } from "@/data/exercise-library";
import { useExerciseStore } from "@/store/use-exercise-store";
import { useWorkoutStore } from "@/store/use-workout-store";
import { theme } from "@/theme";

const EMPTY_CUSTOM_EXERCISE = {
  name: "",
  muscleGroup: "Chest",
  youtubeUrl: "",
};

export function LibraryScreen() {
  const router = useRouter();
  const exerciseList = useExerciseStore((state) => state.exerciseList);
  const addCustomExercise = useExerciseStore((state) => state.addCustomExercise);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const addExercise = useWorkoutStore((state) => state.addExercise);

  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<(typeof MUSCLE_GROUPS)[number]>("All");
  const [customExercise, setCustomExercise] = useState(EMPTY_CUSTOM_EXERCISE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return exerciseList.filter((exercise) => {
      const matchesGroup = groupFilter === "All" || exercise.muscleGroup === groupFilter;
      const matchesQuery =
        normalized.length === 0 ||
        exercise.name.toLowerCase().includes(normalized) ||
        exercise.muscleGroup.toLowerCase().includes(normalized);
      return matchesGroup && matchesQuery;
    });
  }, [exerciseList, groupFilter, query]);

  const handleAddCustom = () => {
    const name = customExercise.name.trim();
    const muscleGroup = customExercise.muscleGroup.trim();
    const youtubeUrl = customExercise.youtubeUrl.trim();

    if (!name || !muscleGroup || !youtubeUrl) {
      Alert.alert("Missing details", "Add a name, muscle group, and YouTube URL.");
      return;
    }

    addCustomExercise({ name, muscleGroup, youtubeUrl });
    setCustomExercise(EMPTY_CUSTOM_EXERCISE);
    setIsModalOpen(false);
  };

  const handleAddToWorkout = (exerciseId: string) => {
    if (!activeWorkout) {
      startWorkout("Strength Session");
    }

    addExercise(exerciseId);
    Alert.alert("Added to workout", "The exercise has been added to your active session.");
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader
        title="Exercise Library"
        subtitle="Select exercises, view tutorials, and save custom movements"
        actionLabel="Add custom"
        onActionPress={() => setIsModalOpen(true)}
      />

      {activeWorkout ? (
        <Card style={styles.activeCard}>
          <AppText variant="caption" color="subtext">
            Active workout
          </AppText>
          <AppText variant="sectionTitle">{activeWorkout.name}</AppText>
          <AppText variant="body" color="subtext">
            Add exercises directly to your live session.
          </AppText>
        </Card>
      ) : null}

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search exercises"
        placeholderTextColor={theme.colors.subtext}
        style={styles.searchInput}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {MUSCLE_GROUPS.map((group) => (
          <Pressable
            key={group}
            onPress={() => setGroupFilter(group)}
            style={[styles.filterChip, groupFilter === group ? styles.filterChipActive : null]}
          >
            <AppText variant="caption" color={groupFilter === group ? "background" : "text"}>
              {group}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.list}>
        {filtered.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            subtitle={exercise.muscleGroup}
            onPress={() => router.push(`/exercise/${exercise.id}`)}
            actionLabel={activeWorkout ? "Add to workout" : "Open"}
            onActionPress={
              activeWorkout
                ? () => handleAddToWorkout(exercise.id)
                : () => router.push(`/exercise/${exercise.id}`)
            }
          />
        ))}
      </View>

      {filtered.length === 0 ? (
        <Card>
          <AppText variant="sectionTitle">No exercises found</AppText>
          <AppText variant="body" color="subtext">
            Try a different search or add a custom exercise.
          </AppText>
        </Card>
      ) : null}

      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsModalOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <SectionHeader
              title="Custom Exercise"
              subtitle="Add a new exercise with its YouTube URL"
            />
            <View style={styles.form}>
              <TextInput
                value={customExercise.name}
                onChangeText={(value) =>
                  setCustomExercise((current) => ({ ...current, name: value }))
                }
                placeholder="Exercise name"
                placeholderTextColor={theme.colors.subtext}
                style={styles.searchInput}
              />
              <TextInput
                value={customExercise.muscleGroup}
                onChangeText={(value) =>
                  setCustomExercise((current) => ({ ...current, muscleGroup: value }))
                }
                placeholder="Muscle group"
                placeholderTextColor={theme.colors.subtext}
                style={styles.searchInput}
              />
              <TextInput
                value={customExercise.youtubeUrl}
                onChangeText={(value) =>
                  setCustomExercise((current) => ({ ...current, youtubeUrl: value }))
                }
                placeholder="YouTube URL"
                placeholderTextColor={theme.colors.subtext}
                autoCapitalize="none"
                style={styles.searchInput}
              />
              <Button onPress={handleAddCustom}>Save custom exercise</Button>
            </View>
          </View>
        </View>
      </Modal>
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
  activeCard: {
    gap: theme.spacing.xs,
  },
  searchInput: {
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardElevated,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
  },
  filterRow: {
    gap: theme.spacing.sm,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  list: {
    gap: theme.spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    alignSelf: "center",
  },
  form: {
    gap: theme.spacing.sm,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AppText, Button, Card, SectionHeader, SetInputRow } from "@/components";
import { MUSCLE_GROUPS } from "@/data/exercise-library";
import { useExerciseStore } from "@/store/use-exercise-store";
import { useHistoryStore } from "@/store/use-history-store";
import { useWorkoutStore } from "@/store/use-workout-store";
import { theme } from "@/theme";
import {
  computeWorkoutVolume,
  formatDuration,
  formatSetPreview,
  formatWorkoutValue,
  getExercisePreviousSetPreview,
  getWorkoutSetCount,
} from "@/utils/workout";

type InputRefMap = Record<string, { weight: TextInput | null; reps: TextInput | null }>;

export function WorkoutScreen() {
  const router = useRouter();
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const workoutExercises = activeWorkout?.exercises ?? [];
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const discardWorkout = useWorkoutStore((state) => state.discardWorkout);
  const addExercise = useWorkoutStore((state) => state.addExercise);
  const addSet = useWorkoutStore((state) => state.addSet);
  const updateSet = useWorkoutStore((state) => state.updateSet);
  const toggleSetComplete = useWorkoutStore((state) => state.toggleSetComplete);
  const removeSet = useWorkoutStore((state) => state.removeSet);
  const completeWorkout = useWorkoutStore((state) => state.completeWorkout);
  const exerciseList = useExerciseStore((state) => state.exerciseList);
  const workouts = useHistoryStore((state) => state.workouts);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<(typeof MUSCLE_GROUPS)[number]>("All");

  const inputRefs = useRef<InputRefMap>({});

  useEffect(() => {
    if (!activeWorkout) {
      setElapsedSeconds(0);
      return;
    }

    const tick = () => {
      setElapsedSeconds(
        Math.max(0, Math.round((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 1000)),
      );
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return exerciseList.filter((exercise) => {
      const matchesGroup = groupFilter === "All" || exercise.muscleGroup === groupFilter;
      const matchesQuery =
        query.length === 0 ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscleGroup.toLowerCase().includes(query);

      return matchesGroup && matchesQuery;
    });
  }, [exerciseList, groupFilter, searchQuery]);

  const currentSetCount = getWorkoutSetCount({ exercises: workoutExercises });
  const currentVolume = computeWorkoutVolume({ exercises: workoutExercises });
  const isWorkoutLive = Boolean(activeWorkout);

  const openExercisePicker = () => {
    if (!activeWorkout) {
      startWorkout("Strength Session");
    }
    setIsPickerOpen(true);
  };

  const handleAddExercise = (exerciseId: string) => {
    const workout = activeWorkout ?? startWorkout("Strength Session");
    const workoutExercise = addExercise(exerciseId);
    setIsPickerOpen(false);

    if (workoutExercise && workout.id && workoutExercise.id) {
      const key = `${workoutExercise.id}:${workoutExercise.sets[0]?.id ?? ""}`;
      setTimeout(() => {
        inputRefs.current[key]?.weight?.focus();
      }, 0);
    }
  };

  const handleStartWorkout = () => {
    startWorkout("Strength Session");
  };

  const handleFinishWorkout = () => {
    const workout = completeWorkout();
    if (!workout) {
      Alert.alert("No workout saved", "Add at least one exercise before saving your workout.");
      return;
    }

    const newPrExercises = workout.exercises.filter((exercise) => exercise.newPr).length;
    Alert.alert(
      "Workout saved",
      `${workout.name} • ${workout.exerciseCount} exercises • ${getWorkoutSetCount(workout)} sets${newPrExercises > 0 ? `\n${newPrExercises} new PR${newPrExercises === 1 ? "" : "s"}` : ""}`,
      [
        {
          text: "View workout",
          onPress: () => router.push(`/history/${workout.id}`),
        },
      ],
    );
  };

  const handleDiscardWorkout = () => {
    Alert.alert("Discard workout?", "This clears the active session and all logged sets.", [
      { text: "Cancel", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: discardWorkout },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <AppText variant="caption" color="subtext">
              Active workout
            </AppText>
            <AppText variant="display">{activeWorkout?.name ?? "Strength Session"}</AppText>
            <AppText variant="body" color="subtext">
              {isWorkoutLive
                ? "Log each set quickly. The table keeps your next load visible without clutter."
                : "Start a session and begin logging in a single tap."}
            </AppText>
          </View>

          <View style={styles.timer}>
            <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
            <AppText variant="sectionTitle">{formatDuration(elapsedSeconds)}</AppText>
            <AppText variant="caption" color="subtext">
              elapsed
            </AppText>
          </View>
        </View>

        <Card elevated style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <AppText variant="caption" color="primary">
                {isWorkoutLive ? "Live session" : "Not started"}
              </AppText>
            </View>

            <View style={styles.summaryMetrics}>
              <View style={styles.metric}>
                <AppText variant="caption" color="subtext">
                  Exercises
                </AppText>
                <AppText variant="sectionTitle">{workoutExercises.length}</AppText>
              </View>
              <View style={styles.metric}>
                <AppText variant="caption" color="subtext">
                  Sets
                </AppText>
                <AppText variant="sectionTitle">{currentSetCount}</AppText>
              </View>
              <View style={styles.metric}>
                <AppText variant="caption" color="subtext">
                  Volume
                </AppText>
                <AppText variant="sectionTitle">{formatWorkoutValue(currentVolume)} kg</AppText>
              </View>
            </View>
          </View>

          {!isWorkoutLive ? (
            <View style={styles.emptyWorkout}>
              <AppText variant="sectionTitle">Ready to train</AppText>
              <AppText variant="body" color="subtext">
                Start the workout, add an exercise, and keep logging without leaving the screen.
              </AppText>
              <Button onPress={handleStartWorkout}>Start Workout</Button>
            </View>
          ) : null}
        </Card>

        {isWorkoutLive ? (
          <View style={styles.exerciseList}>
            {workoutExercises.map((exercise, exerciseIndex) => (
              <Card key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseTitle}>
                    <AppText variant="sectionTitle">{exercise.exerciseName}</AppText>
                    <AppText variant="caption" color="subtext">
                      {exercise.muscleGroup}
                    </AppText>
                  </View>

                  <Pressable
                    onPress={() => router.push(`/exercise/${exercise.exerciseId}`)}
                    style={styles.videoButton}
                  >
                    <Ionicons name="logo-youtube" size={16} color="#FF2D2D" />
                  </Pressable>
                </View>

                <View style={styles.tableHeader}>
                  <AppText variant="caption" color="subtext" style={styles.tableSet}>
                    Set
                  </AppText>
                  <AppText variant="caption" color="subtext" style={styles.tablePrev}>
                    Previous
                  </AppText>
                  <AppText variant="caption" color="subtext" style={styles.tableInput}>
                    Weight
                  </AppText>
                  <AppText variant="caption" color="subtext" style={styles.tableInput}>
                    Reps
                  </AppText>
                  <AppText variant="caption" color="subtext" style={styles.tableCheck}>
                    ✓
                  </AppText>
                </View>

                <View style={styles.setRows}>
                  {exercise.sets.map((setItem, setIndex) => {
                    const rowKey = `${exercise.id}:${setItem.id}`;
                    const nextSet = exercise.sets[setIndex + 1] ?? null;
                    const previousSet = exercise.sets[setIndex - 1];
                    const historyPreview = getExercisePreviousSetPreview(
                      workouts,
                      exercise.exerciseId,
                    );
                    const previousValue =
                      setIndex > 0 && previousSet
                        ? formatSetPreview(previousSet)
                        : (historyPreview ?? undefined);

                    return (
                      <SetInputRow
                        key={setItem.id}
                        setNumber={setIndex + 1}
                        previousValue={previousValue}
                        reps={setItem.reps}
                        weight={setItem.weight}
                        isCompleted={setItem.isCompleted}
                        onChangeReps={(value) => updateSet(exercise.id, setItem.id, "reps", value)}
                        onChangeWeight={(value) =>
                          updateSet(exercise.id, setItem.id, "weight", value)
                        }
                        onToggleComplete={() => toggleSetComplete(exercise.id, setItem.id)}
                        onRemove={
                          exercise.sets.length > 1
                            ? () => removeSet(exercise.id, setItem.id)
                            : undefined
                        }
                        weightInputRef={(node) => {
                          inputRefs.current[rowKey] = {
                            weight: node,
                            reps: inputRefs.current[rowKey]?.reps ?? null,
                          };
                        }}
                        repsInputRef={(node) => {
                          inputRefs.current[rowKey] = {
                            weight: inputRefs.current[rowKey]?.weight ?? null,
                            reps: node,
                          };
                        }}
                        onWeightSubmitEditing={() => {
                          inputRefs.current[rowKey]?.reps?.focus();
                        }}
                        onRepsSubmitEditing={() => {
                          if (nextSet) {
                            const nextKey = `${exercise.id}:${nextSet.id}`;
                            inputRefs.current[nextKey]?.weight?.focus();
                            return;
                          }

                          if (exerciseIndex < workoutExercises.length - 1) {
                            const nextExercise = workoutExercises[exerciseIndex + 1];
                            if (nextExercise) {
                              const nextExerciseRowKey = `${nextExercise.id}:${nextExercise.sets[0]?.id ?? ""}`;
                              inputRefs.current[nextExerciseRowKey]?.weight?.focus();
                            }
                          }
                        }}
                      />
                    );
                  })}
                </View>

                <View style={styles.exerciseFooter}>
                  <Pressable onPress={() => addSet(exercise.id)} style={styles.inlineAdd}>
                    <Ionicons name="add" size={16} color={theme.colors.primary} />
                    <AppText variant="caption" color="primary">
                      Add set
                    </AppText>
                  </Pressable>

                  <View style={styles.exerciseMeta}>
                    <AppText variant="caption" color="subtext">
                      Previous
                    </AppText>
                    <AppText variant="caption">
                      {getExercisePreviousSetPreview(workouts, exercise.exerciseId) ?? "No history"}
                    </AppText>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        {isWorkoutLive ? (
          <View style={styles.bottomActions}>
            <Button onPress={openExercisePicker}>Add Exercise</Button>
            <Button variant="ghost" onPress={handleFinishWorkout} disabled={currentSetCount === 0}>
              Save Workout
            </Button>
            <Button variant="ghost" onPress={handleDiscardWorkout}>
              Discard
            </Button>
          </View>
        ) : null}
      </ScrollView>

      {isWorkoutLive ? (
        <Pressable onPress={openExercisePicker} style={styles.fab}>
          <Ionicons name="add" size={22} color={theme.colors.background} />
        </Pressable>
      ) : null}

      <Modal
        visible={isPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsPickerOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <SectionHeader title="Add Exercise" subtitle="Pick a movement for this workout" />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
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
                  style={[
                    styles.filterChip,
                    groupFilter === group ? styles.filterChipActive : null,
                  ]}
                >
                  <AppText variant="caption" color={groupFilter === group ? "background" : "text"}>
                    {group}
                  </AppText>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              <View style={styles.exercisePickerList}>
                {filteredExercises.map((exercise) => (
                  <Pressable
                    key={exercise.id}
                    onPress={() => handleAddExercise(exercise.id)}
                    style={({ pressed }) => [styles.exercisePickerRow, pressed && styles.pressed]}
                  >
                    <View style={styles.exercisePickerCopy}>
                      <AppText variant="body">{exercise.name}</AppText>
                      <AppText variant="caption" color="subtext">
                        {exercise.muscleGroup}
                      </AppText>
                    </View>
                    <View style={styles.exercisePickerAction}>
                      <AppText variant="caption" color="primary">
                        Add
                      </AppText>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 136,
    gap: theme.spacing.lg,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
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
  timer: {
    minWidth: 92,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    gap: 4,
  },
  summaryCard: {
    gap: theme.spacing.md,
  },
  summaryTop: {
    gap: theme.spacing.md,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(0, 255, 136, 0.08)",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  summaryMetrics: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  metric: {
    flex: 1,
    gap: 4,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyWorkout: {
    gap: theme.spacing.sm,
  },
  exerciseList: {
    gap: theme.spacing.md,
  },
  exerciseCard: {
    gap: theme.spacing.sm,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  exerciseTitle: {
    flex: 1,
    gap: 4,
  },
  videoButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: 2,
  },
  tableSet: {
    width: 30,
    textAlign: "center",
  },
  tablePrev: {
    flex: 1,
    minWidth: 68,
  },
  tableInput: {
    width: 78,
    textAlign: "center",
  },
  tableCheck: {
    width: 26,
    textAlign: "center",
  },
  setRows: {
    gap: 8,
    marginTop: 2,
  },
  exerciseFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    paddingTop: 2,
  },
  inlineAdd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryMuted,
  },
  exerciseMeta: {
    alignItems: "flex-end",
  },
  bottomActions: {
    gap: theme.spacing.sm,
  },
  fab: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    alignSelf: "center",
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
  sheetContent: {
    paddingBottom: theme.spacing.xl,
  },
  exercisePickerList: {
    gap: 10,
  },
  exercisePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  exercisePickerCopy: {
    flex: 1,
    gap: 4,
  },
  exercisePickerAction: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryMuted,
  },
  pressed: {
    opacity: 0.92,
  },
});

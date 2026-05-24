import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  AppText,
  ExerciseCard,
  ExerciseItem,
  PrimaryButton,
  ScreenContainer,
  SectionHeader,
} from "@/components";
import { theme } from "@/theme";

const exerciseLibrary = [
  { id: "incline-press", name: "Incline Bench Press", muscleGroup: "Chest" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "Back" },
  { id: "rdl", name: "Romanian Deadlift", muscleGroup: "Hamstrings" },
  { id: "split-squat", name: "Bulgarian Split Squat", muscleGroup: "Legs" },
];

function makeSet(index: number) {
  return { id: `set-${Date.now()}-${index}`, reps: "", weight: "" };
}

export function WorkoutScreen() {
  const [isActiveWorkout] = useState(true);
  const [restSeconds] = useState(74);
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    {
      id: "bench",
      name: "Bench Press",
      muscleGroup: "Chest",
      sets: [makeSet(1), makeSet(2)],
    },
    {
      id: "row",
      name: "Seated Cable Row",
      muscleGroup: "Back",
      sets: [makeSet(1)],
    },
  ]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["42%", "72%"], []);

  const openAddExercise = () => bottomSheetRef.current?.present();

  const addExercise = (id: string, name: string, muscleGroup: string) => {
    setExercises((current) => [...current, { id, name, muscleGroup, sets: [makeSet(1)] }]);
    bottomSheetRef.current?.dismiss();
  };

  const onAddSet = (exerciseId: string) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [...exercise.sets, makeSet(exercise.sets.length + 1)],
            }
          : exercise,
      ),
    );
  };

  const onChangeSet = (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: string,
  ) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <SectionHeader title="Workout Builder" subtitle="Build and track every set" />

        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <View style={styles.dot} />
            <AppText variant="caption">
              {isActiveWorkout ? "Active workout" : "Workout paused"}
            </AppText>
          </View>
          <View style={styles.timerCard}>
            <AppText variant="caption" color="subtext">
              Rest timer
            </AppText>
            <AppText variant="sectionTitle">
              {Math.floor(restSeconds / 60)}:{`${restSeconds % 60}`.padStart(2, "0")}
            </AppText>
          </View>
        </View>

        <PrimaryButton onPress={openAddExercise}>Add Exercise</PrimaryButton>

        <FlashList
          data={exercises}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60)}>
              <ExerciseCard exercise={item} onAddSet={onAddSet} onChangeSet={onChangeSet} />
            </Animated.View>
          )}
        />
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <SectionHeader title="Add Exercise" subtitle="Pick from your library" />
          {exerciseLibrary.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => addExercise(item.id, item.name, item.muscleGroup)}
              style={({ pressed }) => [styles.sheetItem, pressed ? styles.sheetItemPressed : null]}
            >
              <AppText variant="sectionTitle">{item.name}</AppText>
              <AppText variant="caption" color="subtext">
                {item.muscleGroup}
              </AppText>
            </Pressable>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.md,
  },
  statusRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statusPill: {
    flex: 1,
    minHeight: 56,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  timerCard: {
    width: 120,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
    gap: 2,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  sheetBackground: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  sheetHandle: {
    backgroundColor: theme.colors.subtext,
  },
  sheetContent: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sheetItem: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardElevated,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: 2,
  },
  sheetItemPressed: {
    opacity: 0.84,
  },
});

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState, memo } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  Vibration,
  View,
} from "react-native";
import { PremiumHeader } from "@/components";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SetInputRow } from "@/components/set-input-row";
import { MUSCLE_GROUPS } from "@/data/exercise-library";
import { useExerciseStore } from "@/store/use-exercise-store";
import { useHistoryStore } from "@/store/use-history-store";
import { useToastStore } from "@/store/use-toast-store";
import { useWorkoutStore } from "@/store/use-workout-store";
import type { Workout } from "@/types/workout";
import {
  formatSetPreview,
  getExercisePreviousSetPreview,
  getWorkoutSetCount,
  toIsoDate,
  getTodayDefaultWorkoutName,
} from "@/utils/workout";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#E5C158";
const BG_DARK = "#0F0F0F";
const GLASS_BG = "rgba(28, 28, 28, 0.8)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.08)";
const TEXT_MAIN = "#E5E2E1";
const TEXT_MUTED = "#A0A0A0";
const DARK_GOLD = "#1A1A1A";
const BORDER = "rgba(255, 255, 255, 0.08)";
const TEXT = "#E5E2E1";
const TEXT_SUB = "#A0A0A0";
const TEXT_DIM = "rgba(255, 255, 255, 0.4)";
const SURFACE_HIGH = "rgba(255, 255, 255, 0.05)";

const BG_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLu24nWykqZgevYWrQMAhU9O5LgBS6uhrv8kZkt-qWLqrh5ajV_SDAiglamnC3NvDMH372x4edKvbx-k-j25zf8loO3IpIH3g7jM30OqlaJ2uKaJCG4QX00E_wGUNrrE40-OQguDWv4lOa1w3f_83zHHR0vrk2-8bRDM3D9-V6CLshfW3OKB5q5wee_qT1yPfdtHL_YUU3tq5YfS0gCMGjqORk8K2HKT9bwdoeqgTW0bhM_XHw44gEaW9xg";
const BG_PATTERN_OVERLAY =
  "https://lh3.googleusercontent.com/aida/AP1WRLF0eRL9PCMph4Zj755O_n42jVLK-BqtvU2PyCWoY_bl8GLgdfgTZ9NNQH25m3FjrrA0uZQT4fUfUR6t5ycREAzDR16XrX55UzRVxSEMDIeEIMx1pL1IrPUH4IZZ44CBEky-rBaMYUD-slms2jqlRBTXZqiZ_lMQOalXwLptSGMJA1vOA5rOaF13R9oBZF6PxRT-Bngvci6u-bqj-Te8YOULhF-mEI_uTL-wq7PCWh0ytfAFyVsZVzl5w";
const AVATAR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBFYjvh7gzy6AiKmPJTpZZ_wFDahPj0dmlx-e1U_rbZWImwLsPNZ5Rx6t45WbPNrPkKyA2d-yHDUb0TGQxfT284KfPsI0WfKR5LcHGeC0DBjI6mJLU78LcuXXjp6tYPEjuABSy1ztkPKmA_gTbPFYzILTZUTNsKdLjZRVEyULOJWiZrIbSvfCBIHMV6wiSjk8tl1fVuvSlkZTX_Gm2uYc7Dq95ln5caLCCVw8LhZGqhDTfHCYvA8QLvriApsx-wAs53I4KnX96mk8U";

const Particle = memo(function Particle({ delay, height }: { delay: number; height: number }) {
  const left = useMemo(() => Math.random() * 100, []);
  const top = useMemo(() => Math.random() * 100, []);
  const size = useMemo(() => Math.random() * 3 + 1, []);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    const duration = Math.random() * 20000 + 30000;

    const timeout = setTimeout(() => {
      translateY.value = withRepeat(withTiming(-(height + 140), { duration }), -1, false);
      opacity.value = withRepeat(withTiming(0.2, { duration: 2200 }), -1, true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, height, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        s.particle,
        {
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
});

const GoldDustParticles = memo(function GoldDustParticles() {
  const { height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 20 }).map((_, index) => (
        <Particle key={index} delay={index * 500} height={height} />
      ))}
    </View>
  );
});

type InputRefMap = Record<string, { weight: TextInput | null; reps: TextInput | null }>;

export function WorkoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const exercises = useMemo(() => activeWorkout?.exercises ?? [], [activeWorkout?.exercises]);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const discardWorkout = useWorkoutStore((s) => s.discardWorkout);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const addSet = useWorkoutStore((s) => s.addSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const toggleSetComplete = useWorkoutStore((s) => s.toggleSetComplete);
  const removeSet = useWorkoutStore((s) => s.removeSet);
  const completeWorkout = useWorkoutStore((s) => s.completeWorkout);
  const resumeWorkout = useWorkoutStore((s) => s.resumeWorkout);
  const exerciseList = useExerciseStore((s) => s.exerciseList);
  const workouts = useHistoryStore((s) => s.workouts);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<(typeof MUSCLE_GROUPS)[number]>("All");
  const [completedExerciseIds, setCompletedExerciseIds] = useState<Record<string, boolean>>({});
  const lastActiveWorkoutIdRef = useRef<string | null>(null);
  const inputRefs = useRef<InputRefMap>({});

  // ─── Custom Exercise Creator States ────────────────────────────────────────
  const [modalTab, setModalTab] = useState<"catalog" | "new">("catalog");
  const [customName, setCustomName] = useState("");
  const [customGroup, setCustomGroup] = useState<string>("Chest");
  const [customYoutube, setCustomYoutube] = useState("");
  const todayDate = toIsoDate();
  const todayWorkout = useMemo(
    () => workouts.find((workout) => workout.date === todayDate) ?? null,
    [todayDate, workouts],
  );
  const hasWorkoutToday = Boolean(todayWorkout);

  const formMuscleGroups = useMemo(() => {
    return MUSCLE_GROUPS.filter((g) => g !== "All");
  }, []);

  const handleOpenPicker = () => {
    setModalTab("catalog");
    setSearch("");
    setGroupFilter("All");
    setCustomName("");
    setCustomYoutube("");
    setCustomGroup("Chest");
    setPickerOpen(true);
  };

  const handleStartWorkout = () => {
    if (hasWorkoutToday) {
      if (todayWorkout) {
        router.push(`/history/${todayWorkout.id}`);
      }
      return;
    }

    const defaultName = getTodayDefaultWorkoutName();
    startWorkout(defaultName);
  };

  const handleResumeWorkout = (workout: Workout) => {
    resumeWorkout(workout);
    Vibration.vibrate(40);
  };

  useEffect(() => {
    const activeId = activeWorkout?.id ?? null;
    if (activeId !== lastActiveWorkoutIdRef.current) {
      lastActiveWorkoutIdRef.current = activeId;
      if (!activeWorkout) {
        setCompletedExerciseIds({});
        return;
      }
      const completed: Record<string, boolean> = {};
      activeWorkout.exercises.forEach((ex) => {
        if (ex.sets.length > 0 && ex.sets.every((s) => s.isCompleted)) {
          completed[ex.id] = true;
        }
      });
      setCompletedExerciseIds(completed);
    }
  }, [activeWorkout]);

  const handleCompleteExercise = (exerciseId: string) => {
    setCompletedExerciseIds((prev) => ({ ...prev, [exerciseId]: true }));
    Vibration.vibrate(40);
  };

  const handleEditExercise = (exerciseId: string) => {
    setCompletedExerciseIds((prev) => {
      const copy = { ...prev };
      delete copy[exerciseId];
      return copy;
    });
    Vibration.vibrate(40);
  };

  const handleCreateCustomAndAdd = () => {
    const nameTrimmed = customName.trim();
    if (!nameTrimmed) {
      useToastStore.getState().show({
        title: "Invalid Input",
        message: "Please enter a movement name.",
        type: "error",
      });
      return;
    }

    const addCustomExercise = useExerciseStore.getState().addCustomExercise;
    const newEx = addCustomExercise({
      name: nameTrimmed,
      muscleGroup: customGroup,
      youtubeUrl: customYoutube.trim(),
    });

    // Reset states & close modal
    setCustomName("");
    setCustomYoutube("");
    setCustomGroup("Chest");
    setModalTab("catalog");
    setPickerOpen(false);

    // Add to active session
    handleAddExercise(newEx.id);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exerciseList.filter((e) => {
      const g = groupFilter === "All" || e.muscleGroup === groupFilter;
      const s = !q || e.name.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q);
      return g && s;
    });
  }, [exerciseList, groupFilter, search]);

  const isLive = Boolean(activeWorkout);
  const hasExercises = exercises.length > 0;
  const currentExercise = exercises[exercises.length - 1] ?? null;
  const currentSetIndex = currentExercise
    ? currentExercise.sets.findIndex((set) => !set.isCompleted)
    : -1;

  const [startedExerciseIds, setStartedExerciseIds] = useState<Record<string, boolean>>({});

  const handleStartExercise = (exerciseId: string) => {
    setStartedExerciseIds((prev) => ({ ...prev, [exerciseId]: true }));
    Vibration.vibrate(40);
  };

  const handleAddExercise = (exerciseId: string) => {
    const workout = activeWorkout ?? startWorkout("Strength Session");
    const ex = addExercise(exerciseId);
    setPickerOpen(false);
    if (ex && workout.id) {
      const key = `${ex.id}:${ex.sets[0]?.id ?? ""}`;
      setTimeout(() => inputRefs.current[key]?.weight?.focus(), 300);
    }
  };

  const handleFinish = () => {
    const w = completeWorkout();
    if (!w) {
      useToastStore.getState().show({
        title: "No workout saved",
        message: "Add at least one exercise first.",
        type: "info",
      });
      return;
    }
    const prs = w.exercises.filter((e) => e.newPr).length;
    const msg = `${w.name} • ${w.exerciseCount} exercises • ${getWorkoutSetCount(w)} sets${prs > 0 ? ` • ${prs} new PR${prs > 1 ? "s" : ""}` : ""}`;

    useToastStore.getState().show({
      title: "Workout saved",
      message: msg,
      type: "success",
      action: {
        label: "View",
        onPress: () => router.push(`/history/${w.id}`),
      },
    });
  };

  const handleDiscard = () => {
    if (Platform.OS === "web") {
      const confirm = window.confirm("Discard workout? This will clear the active session.");
      if (confirm) {
        discardWorkout();
      }
    } else {
      Alert.alert("Discard workout?", "This will clear the active session.", [
        { text: "Cancel", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: discardWorkout },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.root}>
      <Image source={{ uri: BG_HERO_IMAGE }} resizeMode="cover" style={s.backgroundImage} />
      <Image source={{ uri: BG_PATTERN_OVERLAY }} resizeMode="cover" style={s.patternOverlay} />
      <LinearGradient
        colors={["rgba(15, 15, 15, 0.4)", "rgba(15, 15, 15, 0.88)"]}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill}
      />
      <GoldDustParticles />

      {/* ── App Bar ── */}
      <View
        style={[
          s.headerWrapper,
          { paddingTop: insets.top + 14 },
          width < 390 && s.headerWrapperCompact,
        ]}
      >
        <PremiumHeader
          title="Workout"
          leftIcon="close"
          onLeftPress={handleDiscard}
          right={
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {isLive && hasExercises && (
                <Pressable
                  onPress={handleFinish}
                  style={({ pressed }) => [s.finishChip, pressed && { opacity: 0.8 }]}
                >
                  <Text style={s.finishChipText}>FINISH</Text>
                </Pressable>
              )}
              <View style={s.avatarRing}>
                <Image source={{ uri: AVATAR_IMAGE }} style={s.avatarImg} />
              </View>
            </View>
          }
        />
      </View>

      <ScrollView
        style={s.scrollViewport}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scroll,
          isWide ? s.scrollWide : null,
          { paddingBottom: 114 + Math.max(insets.bottom, 16) },
        ]}
      >
        <Text style={s.screenTitle}>{activeWorkout?.name ?? "Strength Session"}</Text>
        {hasWorkoutToday && !activeWorkout && (
          <Text style={s.screenSub}>You already completed today’s workout.</Text>
        )}

        {/* ── Exercise list or empty state ── */}
        {isLive ? (
          <View>
            {!hasExercises && (
              <View style={s.emptyWorkoutPrompt}>
                <MaterialIcons name="add-circle-outline" size={32} color={GOLD} />
                <Text style={s.emptyWorkoutPromptTitle}>Add your first exercise</Text>
                <Text style={s.emptyWorkoutPromptText}>
                  This workout starts empty on purpose. Add one movement, log the sets, then keep
                  going one exercise at a time.
                </Text>
                <Pressable
                  onPress={handleOpenPicker}
                  style={({ pressed }) => [s.addFirstExerciseBtn, pressed && { opacity: 0.8 }]}
                >
                  <MaterialIcons name="add" size={18} color="#1A1A1A" />
                  <Text style={s.addFirstExerciseText}>ADD FIRST EXERCISE</Text>
                </Pressable>
              </View>
            )}

            {exercises.map((ex, exIdx) => {
              const isStarted = startedExerciseIds[ex.id] ?? exIdx === 0;
              const isCompleted = completedExerciseIds[ex.id] ?? false;

              if (!isStarted) {
                return (
                  <View key={ex.id} style={s.exCardMinimal}>
                    <View style={s.exHeaderMinimal}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.exNameMinimal}>{ex.exerciseName}</Text>
                        <Text style={s.exStatusMinimal}>READY FOR INPUT</Text>
                      </View>
                      <Pressable
                        onPress={() => handleStartExercise(ex.id)}
                        style={({ pressed }) => [
                          s.startSetBtn,
                          pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
                        ]}
                      >
                        <LinearGradient
                          colors={[GOLD_LIGHT, GOLD]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={s.startSetBtnInner}
                        >
                          <Text style={s.startSetBtnTxt}>START SET</Text>
                        </LinearGradient>
                      </Pressable>
                    </View>
                  </View>
                );
              }

              if (isCompleted) {
                return (
                  <View key={ex.id} style={s.exCardMinimal}>
                    <View style={s.exHeaderMinimal}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.exNameMinimal}>{ex.exerciseName}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 4,
                          }}
                        >
                          <View style={s.completedBadge}>
                            <MaterialIcons
                              name="check"
                              size={10}
                              color={GOLD}
                              style={{ marginRight: 2 }}
                            />
                            <Text style={s.completedBadgeText}>COMPLETED</Text>
                          </View>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => handleEditExercise(ex.id)}
                        style={({ pressed }) => [s.editExerciseBtn, pressed && { opacity: 0.8 }]}
                      >
                        <MaterialIcons name="edit" size={12} color={GOLD} />
                        <Text style={s.editExerciseBtnText}>EDIT</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              }

              return (
                <View key={ex.id} style={s.exCard}>
                  {/* Exercise Header */}
                  <View style={s.exHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.exName}>{ex.exerciseName}</Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}
                      >
                        <View style={s.setsCountBadge}>
                          <Text style={s.setsCountBadgeText}>
                            {ex.sets.length} {ex.sets.length === 1 ? "SET" : "SETS"}
                          </Text>
                        </View>
                        <View style={s.prBadge}>
                          <Text style={s.prBadgeText}>PR</Text>
                        </View>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => router.push(`/exercise/${ex.exerciseId}`)}
                      style={{ padding: 4 }}
                    >
                      <MaterialIcons name="info-outline" size={20} color={TEXT_MUTED} />
                    </Pressable>
                  </View>

                  {/* Table Header */}
                  <View style={s.tableHead}>
                    <Text style={[s.tableHeadTxt, { width: 32 }]}>SET</Text>
                    <Text style={[s.tableHeadTxt, { flex: 1, textAlign: "left", paddingLeft: 8 }]}>
                      PREVIOUS
                    </Text>
                    <Text style={[s.tableHeadTxt, { width: 64, marginRight: 8 }]}>KG</Text>
                    <Text style={[s.tableHeadTxt, { width: 64, marginRight: 8 }]}>REPS</Text>
                    <Text style={[s.tableHeadTxt, { width: 32 }]}>
                      <MaterialIcons name="check-circle" size={14} color={TEXT_MUTED} />
                    </Text>
                  </View>

                  {ex.id === currentExercise?.id && currentExercise && currentSetIndex === -1 && (
                    <View style={s.exerciseCompletedBanner}>
                      <MaterialIcons name="check-circle" size={18} color={GOLD} />
                      <Text style={s.exerciseCompletedText}>
                        This exercise is complete. Add another exercise or finish the workout.
                      </Text>
                    </View>
                  )}

                  {/* Sets Wrap */}
                  <View style={s.setsWrap}>
                    {ex.sets.map((set, setIdx) => {
                      const rowKey = `${ex.id}:${set.id}`;
                      const nextSet = ex.sets[setIdx + 1] ?? null;
                      const prev =
                        setIdx > 0 && ex.sets[setIdx - 1]
                          ? formatSetPreview(ex.sets[setIdx - 1]!)
                          : (getExercisePreviousSetPreview(workouts, ex.exerciseId) ?? undefined);
                      return (
                        <SetInputRow
                          key={set.id}
                          setNumber={setIdx + 1}
                          previousValue={prev}
                          reps={set.reps}
                          weight={set.weight}
                          isCompleted={set.isCompleted}
                          onChangeReps={(v) => updateSet(ex.id, set.id, "reps", v)}
                          onChangeWeight={(v) => updateSet(ex.id, set.id, "weight", v)}
                          onToggleComplete={() => toggleSetComplete(ex.id, set.id)}
                          onRemove={ex.sets.length > 1 ? () => removeSet(ex.id, set.id) : undefined}
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
                          onWeightSubmitEditing={() => inputRefs.current[rowKey]?.reps?.focus()}
                          onRepsSubmitEditing={() => {
                            if (nextSet) {
                              inputRefs.current[`${ex.id}:${nextSet.id}`]?.weight?.focus();
                              return;
                            }
                            const nex = exercises[exIdx + 1];
                            if (nex)
                              inputRefs.current[
                                `${nex.id}:${nex.sets[0]?.id ?? ""}`
                              ]?.weight?.focus();
                          }}
                        />
                      );
                    })}
                  </View>

                  {/* Add Set & Done Buttons Row */}
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingBottom: 12,
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Pressable
                      onPress={() => addSet(ex.id)}
                      style={({ pressed }) => [
                        s.addSetBtn,
                        { flex: 1 },
                        pressed && { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                      ]}
                    >
                      <MaterialIcons name="add" size={16} color="rgba(255, 255, 255, 0.5)" />
                      <Text style={s.addSetTxt}>ADD SET</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleCompleteExercise(ex.id)}
                      style={({ pressed }) => [s.finishExBtn, pressed && { opacity: 0.8 }]}
                    >
                      <MaterialIcons name="check" size={16} color="#1A1A1A" />
                      <Text style={s.finishExBtnText}>DONE</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}

            {/* Dash border wide Add Exercise button */}
            {hasExercises && (
              <Pressable
                onPress={handleOpenPicker}
                style={({ pressed }) => [
                  s.addExerciseBtn,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={s.addExerciseIconContainer}>
                  <MaterialIcons name="add-circle" size={24} color={GOLD} />
                </View>
                <Text style={s.addExerciseText}>ADD EXERCISE</Text>
              </Pressable>
            )}

            {/* Complete Workout Button */}
            {hasExercises && (
              <Pressable
                onPress={handleFinish}
                style={({ pressed }) => [
                  s.completeBtn,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                  { marginTop: 12, marginBottom: 24 },
                ]}
              >
                <LinearGradient
                  colors={[GOLD_LIGHT, GOLD]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.completeBtnInner}
                >
                  <MaterialIcons name="check-circle" size={20} color="#1A1A1A" />
                  <Text style={s.completeBtnTxt}>FINISH WORKOUT</Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>
        ) : hasWorkoutToday ? (
          <View style={s.completedSummaryCard}>
            <View style={s.completedHeader}>
              <View style={s.completedCheckIcon}>
                <MaterialIcons name="check-circle" size={24} color={GOLD} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.completedTitle}>Workout Completed</Text>
                <Text style={s.completedName}>{todayWorkout?.name ?? "Strength Session"}</Text>
              </View>
              <Pressable
                onPress={() => todayWorkout && handleResumeWorkout(todayWorkout)}
                style={({ pressed }) => [s.editWorkoutBtn, pressed && { opacity: 0.8 }]}
              >
                <MaterialIcons name="edit" size={16} color={GOLD} />
                <Text style={s.editWorkoutBtnText}>EDIT</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={s.emptyCard}>
            <MaterialIcons name="fitness-center" size={40} color="rgba(212, 175, 55, 0.4)" />
            <Text style={s.emptyTitle}>Ready to train</Text>
            <Text style={s.emptySub}>
              Start a session, then add exercises one by one as you finish each movement.
            </Text>
            <Pressable onPress={handleStartWorkout} style={s.startBtn}>
              <LinearGradient
                colors={[GOLD_LIGHT, GOLD]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.startBtnInner}
              >
                <Text style={s.startBtnTxt}>START SESSION</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ── Exercise Picker Modal ── */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={s.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setPickerOpen(false)} />
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Add Exercise</Text>
            <Text style={s.modalSub}>Select from catalog or register a custom movement</Text>

            {/* Sliding Tabs */}
            <View style={s.modalTabContainer}>
              <Pressable
                onPress={() => setModalTab("catalog")}
                style={[s.modalTab, modalTab === "catalog" && s.modalTabActive]}
              >
                <MaterialIcons
                  name="search"
                  size={16}
                  color={modalTab === "catalog" ? DARK_GOLD : TEXT_SUB}
                  style={{ marginRight: 6 }}
                />
                <Text style={[s.modalTabText, modalTab === "catalog" && s.modalTabTextActive]}>
                  CATALOG
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setModalTab("new")}
                style={[s.modalTab, modalTab === "new" && s.modalTabActive]}
              >
                <MaterialIcons
                  name="add-box"
                  size={16}
                  color={modalTab === "new" ? DARK_GOLD : TEXT_SUB}
                  style={{ marginRight: 6 }}
                />
                <Text style={[s.modalTabText, modalTab === "new" && s.modalTabTextActive]}>
                  NEW MOVEMENT
                </Text>
              </Pressable>
            </View>

            {modalTab === "catalog" ? (
              <View style={{ flex: 1 }}>
                {/* Search */}
                <View style={s.searchRow}>
                  <MaterialIcons name="search" size={18} color={TEXT_DIM} style={s.searchIcon} />
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search exercises…"
                    placeholderTextColor={TEXT_DIM}
                    style={s.searchInput}
                  />
                </View>

                {/* Muscle group chips */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={s.chipScroll}
                  contentContainerStyle={s.chipContent}
                >
                  {MUSCLE_GROUPS.map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => setGroupFilter(g)}
                      style={[s.chip, g === groupFilter && s.chipActive]}
                    >
                      <Text style={[s.chipTxt, g === groupFilter && s.chipTxtActive]}>{g}</Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {/* Exercise list */}
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  style={s.exList}
                >
                  {filtered.map((ex) => (
                    <Pressable
                      key={ex.id}
                      onPress={() => handleAddExercise(ex.id)}
                      style={({ pressed }) => [s.exRow, pressed && s.exRowActive]}
                    >
                      <View style={s.exRowLeft}>
                        <Text style={s.exRowName}>{ex.name}</Text>
                        <Text style={s.exRowGroup}>{ex.muscleGroup}</Text>
                      </View>
                      <View style={s.addBadge}>
                        <Text style={s.addBadgeTxt}>Add</Text>
                      </View>
                    </Pressable>
                  ))}
                  {filtered.length === 0 && (
                    <View style={s.noResults}>
                      <Text style={s.noResultsTxt}>No exercises found</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            ) : (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={s.formContainer}
              >
                {/* Movement Name */}
                <View style={s.formGroup}>
                  <Text style={s.formLabel}>MOVEMENT NAME</Text>
                  <View style={s.inputWrapper}>
                    <MaterialIcons
                      name="fitness-center"
                      size={16}
                      color={TEXT_DIM}
                      style={s.inputIcon}
                    />
                    <TextInput
                      value={customName}
                      onChangeText={setCustomName}
                      placeholder="e.g. Dumbbell Hammer Curl"
                      placeholderTextColor={TEXT_DIM}
                      style={s.formInput}
                    />
                  </View>
                </View>

                {/* Target Muscle Group */}
                <View style={s.formGroup}>
                  <Text style={s.formLabel}>TARGET MUSCLE GROUP</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={s.formChipScroll}
                    contentContainerStyle={s.formChipContent}
                  >
                    {formMuscleGroups.map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setCustomGroup(g)}
                        style={[s.formChip, g === customGroup && s.formChipActive]}
                      >
                        <Text style={[s.formChipTxt, g === customGroup && s.formChipTxtActive]}>
                          {g}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* YouTube Link */}
                <View style={s.formGroup}>
                  <Text style={s.formLabel}>YOUTUBE VIDEO LINK (OPTIONAL)</Text>
                  <View style={s.inputWrapper}>
                    <MaterialIcons name="link" size={16} color={TEXT_DIM} style={s.inputIcon} />
                    <TextInput
                      value={customYoutube}
                      onChangeText={setCustomYoutube}
                      placeholder="e.g. https://youtube.com/watch?v=..."
                      placeholderTextColor={TEXT_DIM}
                      autoCapitalize="none"
                      keyboardType="url"
                      style={s.formInput}
                    />
                  </View>
                </View>

                {/* Action Button */}
                <Pressable
                  onPress={handleCreateCustomAndAdd}
                  style={({ pressed }) => [s.formSubmitBtn, pressed && s.formSubmitBtnActive]}
                >
                  <MaterialIcons name="add" size={20} color={DARK_GOLD} />
                  <Text style={s.formSubmitBtnText}>CREATE & ADD TO WORKOUT</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_DARK },
  headerWrapper: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headerWrapperCompact: {
    paddingHorizontal: 16,
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.25,
  },
  patternOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.15,
  },
  particle: {
    position: "absolute",
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },

  // App Bar
  appBar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: GLASS_BORDER,
    backgroundColor: "transparent",
  },
  appBarLeft: { flexDirection: "row", alignItems: "center" },
  appBarRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 8, borderRadius: 8 },
  iconBtnActive: { backgroundColor: SURFACE_HIGH },
  timerRow: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  timerText: {
    fontFamily: "Anta_400Regular",
    fontSize: 20,
    color: GOLD,
    letterSpacing: 1.5,
  },
  finishChip: {
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginRight: 10,
    backgroundColor: "rgba(212,175,55,0.08)",
  },
  finishChipText: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    color: GOLD,
    letterSpacing: 1,
  },
  avatarRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.5)",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },

  // Scroll
  scrollViewport: {
    marginBottom: 0,
  },
  scroll: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  scrollWide: {
    paddingHorizontal: 24,
  },
  screenTitle: {
    fontFamily: "Anta_400Regular",
    fontSize: 32,
    color: GOLD,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  screenSub: {
    fontFamily: "Anta_400Regular",
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 20,
  },

  // Exercise Card
  exCard: {
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  exHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: GLASS_BORDER,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exName: {
    fontFamily: "Anta_400Regular",
    fontSize: 18,
    color: TEXT_MAIN,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  setsCountBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  setsCountBadgeText: {
    fontFamily: "Anta_400Regular",
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
  },
  prBadge: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  prBadgeText: {
    fontFamily: "Anta_400Regular",
    fontSize: 9,
    color: GOLD,
    letterSpacing: 0.5,
  },

  emptyWorkoutPrompt: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(28, 28, 28, 0.8)",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(212, 175, 55, 0.2)",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  emptyWorkoutPromptTitle: {
    fontFamily: "Anta_400Regular",
    fontSize: 18,
    color: TEXT_MAIN,
    marginTop: 12,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyWorkoutPromptText: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 20,
  },
  addFirstExerciseBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addFirstExerciseText: {
    fontFamily: "Anta_400Regular",
    fontSize: 12,
    color: "#1A1A1A",
    letterSpacing: 1,
    marginLeft: 4,
    textTransform: "uppercase",
  },

  // Table header
  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
    borderBottomColor: GLASS_BORDER,
  },
  tableHeadTxt: {
    fontFamily: "Anta_400Regular",
    fontSize: 9,
    color: TEXT_MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textAlign: "center",
  },

  // Sets
  setsWrap: { paddingHorizontal: 6, paddingVertical: 8 },
  addSetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 6,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  addSetTxt: {
    fontFamily: "Anta_400Regular",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: 1,
    marginLeft: 4,
    textTransform: "uppercase",
  },

  // Dash wide Add Exercise button
  addExerciseBtn: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "rgba(28, 28, 28, 0.8)",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(212, 175, 55, 0.2)",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  addExerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  addExerciseText: {
    fontFamily: "Anta_400Regular",
    fontSize: 18,
    color: GOLD,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Live stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statTile: {
    width: "48%",
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.37,
    shadowRadius: 16,
    elevation: 4,
  },
  statTileLbl: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 4,
    textAlign: "center",
  },
  statTileVal: {
    fontFamily: "Anta_400Regular",
    fontSize: 24,
    color: TEXT_MAIN,
    textAlign: "center",
  },
  exerciseCompletedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(253,228,0,0.08)",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  exerciseCompletedText: {
    flex: 1,
    fontFamily: "Anta_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: TEXT_DIM,
  },

  // Empty
  emptyCard: {
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 5,
  },
  emptyTitle: {
    fontFamily: "Anta_400Regular",
    fontSize: 22,
    color: GOLD,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  startBtn: {
    borderRadius: 99,
    overflow: "hidden",
  },
  startBtnInner: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnTxt: {
    fontFamily: "Anta_400Regular",
    fontSize: 14,
    color: "#1A1A1A",
    letterSpacing: 1,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "rgba(15, 15, 15, 0.9)",
    borderTopWidth: 1,
    borderTopColor: GLASS_BORDER,
  },
  completeBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  completeBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  completeBtnDisabled: { opacity: 0.4 },
  completeBtnTxt: {
    fontFamily: "Anta_400Regular",
    fontSize: 16,
    color: "#1A1A1A",
    letterSpacing: 0.5,
    marginLeft: 8,
  },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.8)", justifyContent: "flex-end" },
  modalSheet: {
    maxHeight: "92%",
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    backgroundColor: "#161616",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Anta_400Regular",
    fontSize: 20,
    color: GOLD,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalSub: { fontFamily: "Anta_400Regular", fontSize: 13, color: TEXT_MUTED, marginBottom: 16 },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE_HIGH,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontFamily: "Anta_400Regular", fontSize: 14, color: TEXT, height: 44 },

  // Chips
  chipScroll: { marginBottom: 12, flexGrow: 0 },
  chipContent: { paddingRight: 8, alignItems: "center", flexDirection: "row" },
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: { backgroundColor: GOLD, borderColor: GOLD },
  chipTxt: { fontFamily: "Anta_400Regular", fontSize: 11, color: TEXT_MUTED },
  chipTxtActive: { color: "#1A1A1A" },

  // Exercise list in modal
  exList: { flex: 1 },
  exRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginBottom: 8,
  },
  exRowActive: {
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  exRowLeft: { flex: 1, marginRight: 12 },
  exRowName: {
    fontFamily: "Anta_400Regular",
    fontSize: 16,
    color: TEXT_MAIN,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  exRowGroup: { fontFamily: "Anta_400Regular", fontSize: 11, color: TEXT_MUTED },
  addBadge: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  addBadgeTxt: { fontFamily: "Anta_400Regular", fontSize: 11, color: GOLD },
  noResults: { alignItems: "center", paddingVertical: 32 },
  noResultsTxt: { fontFamily: "Anta_400Regular", fontSize: 14, color: TEXT_DIM },

  // Sliding Tab Bar in Modal
  modalTabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
    gap: 4,
  },
  modalTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalTabActive: {
    backgroundColor: GOLD,
  },
  modalTabText: {
    fontFamily: "Anta_400Regular",
    fontSize: 11,
    color: TEXT_MUTED,
    letterSpacing: 1,
  },
  modalTabTextActive: {
    color: "#1A1A1A",
  },

  // Custom Movement Form
  formContainer: {
    paddingTop: 4,
    paddingBottom: 20,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 9,
    color: TEXT_DIM,
    letterSpacing: 1.2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  formInput: {
    flex: 1,
    fontFamily: "Anta_400Regular",
    fontSize: 14,
    color: TEXT_MAIN,
    height: 48,
  },
  formChipScroll: {
    flexGrow: 0,
  },
  formChipContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  formChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE_HIGH,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  formChipActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  formChipTxt: {
    fontFamily: "Anta_400Regular",
    fontSize: 11,
    color: TEXT_SUB,
  },
  formChipTxtActive: {
    color: DARK_GOLD,
  },
  formSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GOLD,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  formSubmitBtnActive: {
    opacity: 0.9,
  },
  formSubmitBtnText: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    color: "#1A1A1A",
    letterSpacing: 1,
    marginLeft: 6,
    textTransform: "uppercase",
  },

  // Minimalist / Ready State Exercise Card
  exCardMinimal: {
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  exHeaderMinimal: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exNameMinimal: {
    fontFamily: "Anta_400Regular",
    fontSize: 18,
    color: TEXT_MAIN,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  exStatusMinimal: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  startSetBtn: {
    borderRadius: 99,
    overflow: "hidden",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  startSetBtnInner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  startSetBtnTxt: {
    fontFamily: "Anta_400Regular",
    fontSize: 12,
    color: "#1A1A1A",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Muscle Focus
  focusCard: {
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  focusTitle: {
    fontFamily: "Anta_400Regular",
    fontSize: 16,
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  focusList: {
    gap: 12,
  },
  focusRow: {
    gap: 6,
  },
  focusLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  focusName: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    color: TEXT_MAIN,
    textTransform: "uppercase",
  },
  focusPercent: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    color: GOLD,
  },
  progressBarTrack: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 99,
    height: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 99,
  },

  // Projected Gains
  gainsCard: {
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  gainsTitle: {
    fontFamily: "Anta_400Regular",
    fontSize: 16,
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  gainsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  gainsSubLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  gainsVal: {
    fontFamily: "Anta_400Regular",
    fontSize: 32,
    color: TEXT_MAIN,
  },
  gainsUnit: {
    fontFamily: "Anta_400Regular",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.4)",
    marginLeft: 2,
  },
  gainsTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gainsTrendText: {
    fontFamily: "Anta_400Regular",
    fontSize: 12,
    textTransform: "uppercase",
  },
  completedSummaryCard: {
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  completedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  completedCheckIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  completedTitle: {
    fontFamily: "Anta_400Regular",
    fontSize: 12,
    color: TEXT_MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  completedName: {
    fontFamily: "Anta_400Regular",
    fontSize: 18,
    color: TEXT_MAIN,
    marginTop: 2,
  },
  editWorkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    backgroundColor: "rgba(212, 175, 55, 0.05)",
  },
  editWorkoutBtnText: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    color: GOLD,
    letterSpacing: 0.5,
  },
  finishExBtn: {
    backgroundColor: GOLD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  finishExBtnText: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  completedBadgeText: {
    fontFamily: "Anta_400Regular",
    fontSize: 9,
    color: GOLD,
    letterSpacing: 0.5,
  },
  editExerciseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    backgroundColor: "rgba(212, 175, 55, 0.05)",
  },
  editExerciseBtnText: {
    fontFamily: "Anta_400Regular",
    fontSize: 12,
    color: GOLD,
    letterSpacing: 0.5,
  },
});

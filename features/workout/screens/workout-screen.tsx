import { MaterialIcons } from "@expo/vector-icons";
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
  Text,
  TextInput,
  View,
} from "react-native";

import { SetInputRow } from "@/components/set-input-row";
import { MUSCLE_GROUPS } from "@/data/exercise-library";
import { useExerciseStore } from "@/store/use-exercise-store";
import { useHistoryStore } from "@/store/use-history-store";
import { useWorkoutStore } from "@/store/use-workout-store";
import {
  computeWorkoutVolume,
  formatDuration,
  formatSetPreview,
  formatWorkoutValue,
  getExercisePreviousSetPreview,
  getWorkoutSetCount,
} from "@/utils/workout";

const GOLD = "#fde400";
const DARK_GOLD = "#201c00";
const BG = "#131313";
const SURFACE = "#1e1e1e";
const SURFACE_HIGH = "#272727";
const SURFACE_LOW = "#1a1a1a";
const BORDER = "#3a3a3a";
const TEXT = "#e5e2e1";
const TEXT_SUB = "#cdc7aa";
const TEXT_DIM = "#636565";

type InputRefMap = Record<string, { weight: TextInput | null; reps: TextInput | null }>;

export function WorkoutScreen() {
  const router = useRouter();
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const exercises = activeWorkout?.exercises ?? [];
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const discardWorkout = useWorkoutStore((s) => s.discardWorkout);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const addSet = useWorkoutStore((s) => s.addSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const toggleSetComplete = useWorkoutStore((s) => s.toggleSetComplete);
  const removeSet = useWorkoutStore((s) => s.removeSet);
  const completeWorkout = useWorkoutStore((s) => s.completeWorkout);
  const exerciseList = useExerciseStore((s) => s.exerciseList);
  const workouts = useHistoryStore((s) => s.workouts);

  const [elapsed, setElapsed] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<(typeof MUSCLE_GROUPS)[number]>("All");
  const inputRefs = useRef<InputRefMap>({});

  // ─── Custom Exercise Creator States ────────────────────────────────────────
  const [modalTab, setModalTab] = useState<"catalog" | "new">("catalog");
  const [customName, setCustomName] = useState("");
  const [customGroup, setCustomGroup] = useState<string>("Chest");
  const [customYoutube, setCustomYoutube] = useState("");

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

  const handleCreateCustomAndAdd = () => {
    const nameTrimmed = customName.trim();
    if (!nameTrimmed) {
      Alert.alert("Invalid Input", "Please enter a movement name.");
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

  useEffect(() => {
    if (!activeWorkout) {
      setElapsed(0);
      return;
    }
    const tick = () =>
      setElapsed(
        Math.max(0, Math.round((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 1000)),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeWorkout]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exerciseList.filter((e) => {
      const g = groupFilter === "All" || e.muscleGroup === groupFilter;
      const s = !q || e.name.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q);
      return g && s;
    });
  }, [exerciseList, groupFilter, search]);

  const setCount = getWorkoutSetCount({ exercises });
  const volume = computeWorkoutVolume({ exercises });
  const isLive = Boolean(activeWorkout);

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
      Alert.alert("No workout saved", "Add at least one exercise first.");
      return;
    }
    const prs = w.exercises.filter((e) => e.newPr).length;
    Alert.alert(
      "Workout saved! 💪",
      `${w.name} • ${w.exerciseCount} exercises • ${getWorkoutSetCount(w)} sets${prs > 0 ? `\n${prs} new PR${prs > 1 ? "s" : ""}` : ""}`,
      [{ text: "View", onPress: () => router.push(`/history/${w.id}`) }, { text: "OK" }],
    );
  };

  const handleDiscard = () => {
    Alert.alert("Discard workout?", "This will clear the active session.", [
      { text: "Cancel", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: discardWorkout },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.root}>
      {/* ── App Bar ── */}
      <View style={s.appBar}>
        <View style={s.appBarLeft}>
          <Pressable
            onPress={handleDiscard}
            style={({ pressed }) => [s.iconBtn, pressed && s.iconBtnActive]}
          >
            <MaterialIcons name="close" size={22} color={TEXT_SUB} />
          </Pressable>
          {isLive && (
            <View style={s.timerRow}>
              <View style={s.timerDot} />
              <Text style={s.timerText}>{formatDuration(elapsed)}</Text>
            </View>
          )}
        </View>
        <View style={s.appBarRight}>
          {isLive && (
            <Pressable onPress={handleFinish} style={s.finishChip}>
              <Text style={s.finishChipText}>FINISH</Text>
            </Pressable>
          )}
          <View style={s.avatar}>
            <Text style={s.avatarText}>J</Text>
          </View>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <Text style={s.screenTitle}>{activeWorkout?.name ?? "Strength Session"}</Text>
        <Text style={s.screenSub}>Log each set quickly.</Text>

        {/* ── Exercise list or empty state ── */}
        {isLive ? (
          <View>
            {exercises.map((ex, exIdx) => (
              <View key={ex.id} style={s.exCard}>
                {/* Exercise header */}
                <View style={s.exHeader}>
                  <View style={s.exHeaderRow}>
                    <View style={s.prBadge}>
                      <MaterialIcons name="local-fire-department" size={11} color={DARK_GOLD} />
                      <Text style={s.prBadgeText}>PR ZONE</Text>
                    </View>
                    <Pressable onPress={() => router.push(`/exercise/${ex.exerciseId}`)}>
                      <MaterialIcons name="info-outline" size={20} color={TEXT_SUB} />
                    </Pressable>
                  </View>
                  <Text style={s.exName}>{ex.exerciseName}</Text>
                  <Text style={s.exMeta}>Target: {ex.sets.length} Sets</Text>
                </View>

                {/* Table header */}
                <View style={s.tableHead}>
                  {["Set", "Previous", "kg", "Reps", "✓"].map((h) => (
                    <Text key={h} style={[s.tableHeadTxt, h === "Previous" && { flex: 1 }]}>
                      {h}
                    </Text>
                  ))}
                </View>

                {/* Sets */}
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

                {/* Add Set */}
                <Pressable
                  onPress={() => addSet(ex.id)}
                  style={({ pressed }) => [s.addSetBtn, pressed && s.addSetBtnActive]}
                >
                  <MaterialIcons name="add" size={16} color={TEXT_DIM} />
                  <Text style={s.addSetTxt}>ADD SET</Text>
                </Pressable>
              </View>
            ))}

            {/* Add Exercise button */}
            <Pressable
              onPress={handleOpenPicker}
              style={({ pressed }) => [s.addExBtn, pressed && s.addExBtnActive]}
            >
              <MaterialIcons name="add-circle-outline" size={20} color={TEXT_SUB} />
              <Text style={s.addExTxt}>ADD EXERCISE</Text>
            </Pressable>

            {/* Live stats */}
            <View style={s.statsGrid}>
              {[
                { label: "Duration", value: `${Math.floor(elapsed / 60)}m` },
                { label: "Volume", value: `${formatWorkoutValue(volume)} kg` },
                { label: "Sets", value: String(setCount) },
                { label: "Intensity", value: "85%" },
              ].map((item) => (
                <View key={item.label} style={s.statTile}>
                  <Text style={s.statTileLbl}>{item.label}</Text>
                  <Text style={s.statTileVal}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={s.emptyCard}>
            <MaterialIcons name="fitness-center" size={40} color={BORDER} />
            <Text style={s.emptyTitle}>Ready to train</Text>
            <Text style={s.emptySub}>
              Start a session, add exercises, and log sets without leaving this screen.
            </Text>
            <Pressable onPress={() => startWorkout("Strength Session")} style={s.startBtn}>
              <Text style={s.startBtnTxt}>START SESSION</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ── Complete button (floating) ── */}
      {isLive && (
        <View style={s.footer}>
          <Pressable
            onPress={handleFinish}
            disabled={setCount === 0}
            style={[s.completeBtn, setCount === 0 && s.completeBtnDisabled]}
          >
            <MaterialIcons
              name="check-circle"
              size={20}
              color={setCount === 0 ? TEXT_DIM : DARK_GOLD}
            />
            <Text style={[s.completeBtnTxt, setCount === 0 && s.completeBtnTxtDisabled]}>
              COMPLETE WORKOUT
            </Text>
          </Pressable>
        </View>
      )}

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
  root: { flex: 1, backgroundColor: BG },

  // App Bar
  appBar: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    backgroundColor: BG,
  },
  appBarLeft: { flexDirection: "row", alignItems: "center" },
  appBarRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 8, borderRadius: 8 },
  iconBtnActive: { backgroundColor: SURFACE_HIGH },
  timerRow: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  timerDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GOLD, marginRight: 6 },
  timerText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 18,
    color: TEXT,
    letterSpacing: -0.5,
  },
  finishChip: {
    borderWidth: 1,
    borderColor: "rgba(253,228,0,0.4)",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginRight: 10,
  },
  finishChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: GOLD,
    letterSpacing: 1.5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: "ArchivoNarrow_700Bold", fontSize: 12, color: DARK_GOLD },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 140 },
  screenTitle: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 18,
    color: TEXT,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  screenSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: TEXT_DIM, marginBottom: 20 },

  // Exercise Card
  exCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  exHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: SURFACE_HIGH,
  },
  exHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  prBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GOLD,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  prBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: DARK_GOLD,
    letterSpacing: 1,
    marginLeft: 3,
  },
  exName: { fontFamily: "ArchivoNarrow_700Bold", fontSize: 17, color: TEXT, marginBottom: 2 },
  exMeta: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: TEXT_DIM,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Table header
  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#161616",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableHeadTxt: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: TEXT_DIM,
    textTransform: "uppercase",
    letterSpacing: 1,
    width: 36,
    textAlign: "center",
  },

  // Sets
  setsWrap: { paddingHorizontal: 6, paddingVertical: 4 },
  addSetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: SURFACE_LOW,
  },
  addSetBtnActive: { backgroundColor: SURFACE_HIGH },
  addSetTxt: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: TEXT_DIM,
    letterSpacing: 1.2,
    marginLeft: 4,
  },

  // Add Exercise button
  addExBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  addExBtnActive: { backgroundColor: SURFACE },
  addExTxt: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: TEXT_DIM,
    letterSpacing: 1.2,
    marginLeft: 8,
  },

  // Live stats grid
  statsGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  statTile: {
    width: "48%",
    backgroundColor: SURFACE_HIGH,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    marginRight: "2%",
  },
  statTileLbl: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: TEXT_DIM,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statTileVal: { fontFamily: "ArchivoNarrow_700Bold", fontSize: 22, color: GOLD },

  // Empty
  emptyCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 18,
    color: TEXT,
    marginTop: 12,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: TEXT_DIM,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  startBtn: { backgroundColor: GOLD, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  startBtnTxt: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 13,
    color: DARK_GOLD,
    letterSpacing: 1.5,
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
    backgroundColor: "rgba(19,19,19,0.96)",
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  completeBtn: {
    backgroundColor: GOLD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  completeBtnDisabled: { backgroundColor: SURFACE_HIGH, opacity: 0.6 },
  completeBtnTxt: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 15,
    color: DARK_GOLD,
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  completeBtnTxtDisabled: { color: TEXT_DIM },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" },
  modalSheet: {
    maxHeight: "92%",
    backgroundColor: SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 16,
    color: TEXT,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  modalSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: TEXT_DIM, marginBottom: 16 },

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
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: TEXT, height: 44 },

  // Chips
  chipScroll: { marginBottom: 12, flexGrow: 0 },
  chipContent: { paddingRight: 8, alignItems: "center", flexDirection: "row" },
  chip: {
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
  chipActive: { backgroundColor: GOLD, borderColor: GOLD },
  chipTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: TEXT_SUB },
  chipTxtActive: { color: DARK_GOLD },

  // Exercise list in modal
  exList: { flex: 1 },
  exRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE_HIGH,
    marginBottom: 8,
  },
  exRowActive: { backgroundColor: "#2f2f2f" },
  exRowLeft: { flex: 1, marginRight: 12 },
  exRowName: { fontFamily: "ArchivoNarrow_700Bold", fontSize: 15, color: TEXT, marginBottom: 2 },
  exRowGroup: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_DIM },
  addBadge: {
    backgroundColor: "rgba(253,228,0,0.15)",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  addBadgeTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: GOLD },
  noResults: { alignItems: "center", paddingVertical: 32 },
  noResultsTxt: { fontFamily: "Inter_400Regular", fontSize: 14, color: TEXT_DIM },

  // Sliding Tab Bar in Modal
  modalTabContainer: {
    flexDirection: "row",
    backgroundColor: SURFACE_LOW,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
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
    borderRadius: 8,
  },
  modalTabActive: {
    backgroundColor: GOLD,
  },
  modalTabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: TEXT_SUB,
    letterSpacing: 0.5,
  },
  modalTabTextActive: {
    color: DARK_GOLD,
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
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: TEXT_DIM,
    letterSpacing: 1.2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE_HIGH,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  formInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: TEXT,
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
    fontFamily: "Inter_600SemiBold",
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
    borderRadius: 10,
    marginTop: 8,
  },
  formSubmitBtnActive: {
    opacity: 0.9,
  },
  formSubmitBtnText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 13,
    color: DARK_GOLD,
    letterSpacing: 1.2,
    marginLeft: 6,
  },
});

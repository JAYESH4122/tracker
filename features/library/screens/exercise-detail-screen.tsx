import { MaterialIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useExerciseStore } from "@/store/use-exercise-store";
import { useHistoryStore } from "@/store/use-history-store";
import { useWorkoutStore } from "@/store/use-workout-store";
import { formatDateLabel, formatWorkoutValue, getYouTubeThumbnailUrl } from "@/utils/workout";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Design Tokens (Matches home-screen) ─────────────────────────────────────
const GOLD = "#fde400";
const DARK_BG = "#131313";
const SURFACE = "#1e1e1e";
const SURFACE_HIGH = "#272727";
const BORDER = "#3a3a3a";
const TEXT = "#e5e2e1";
const TEXT_SUB = "#cdc7aa";
const TEXT_DIM = "#636565";
const DARK_GOLD = "#201c00";
const CARD_R = 12;

export function ExerciseDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ exerciseId?: string }>();
  const exerciseId = params.exerciseId ?? "";
  const exercise = useExerciseStore((state) => state.getExerciseById(exerciseId));
  const workouts = useHistoryStore((state) => state.workouts);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const addExercise = useWorkoutStore((state) => state.addExercise);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);

  // Button Animation States
  const startScale = useSharedValue(1);
  const startStyle = useAnimatedStyle(() => ({ transform: [{ scale: startScale.value }] }));
  const videoScale = useSharedValue(1);
  const videoStyle = useAnimatedStyle(() => ({ transform: [{ scale: videoScale.value }] }));

  if (!exercise) {
    return (
      <View style={s.emptyRoot}>
        <Animated.View entering={FadeInDown.springify()} style={s.emptyCard}>
          <MaterialIcons name="error-outline" size={44} color={GOLD} />
          <Text style={s.emptyTitle}>Movement Not Found</Text>
          <Text style={s.emptySub}>
            The selected exercise could not be loaded from the catalog.
          </Text>
          <Pressable onPress={() => router.back()} style={s.backBtnPreset}>
            <Text style={s.backBtnPresetText}>RETURN TO LIBRARY</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  const thumbnailUrl = getYouTubeThumbnailUrl(exercise.youtubeUrl);

  // ─── Performance Statistics Calculation ────────────────────────────────────
  let allTimeMaxWeight = 0;
  let allTimeMaxWeightReps: number | null = null;
  let allTimeMaxWeightDate: string | null = null;

  workouts.forEach((w) => {
    const exe = w.exercises.find((e) => e.exerciseId === exercise.id);
    if (exe) {
      exe.sets.forEach((set) => {
        if (set.weight !== null && set.weight > allTimeMaxWeight) {
          allTimeMaxWeight = set.weight;
          allTimeMaxWeightReps = set.reps;
          allTimeMaxWeightDate = w.date;
        }
      });
    }
  });

  // Calculate 1RM using Epley's Formula
  const estimated1RM =
    allTimeMaxWeight > 0 && allTimeMaxWeightReps && allTimeMaxWeightReps > 0
      ? Math.round(allTimeMaxWeight * (1 + allTimeMaxWeightReps / 30))
      : null;

  // Filter history of this specific exercise for the timeline
  const exerciseHistory = workouts
    .filter((w) => w.exercises.some((e) => e.exerciseId === exercise.id))
    .map((w) => {
      const workoutExe = w.exercises.find((e) => e.exerciseId === exercise.id);
      let bestSetWeight = 0;
      let bestSetReps = 0;

      workoutExe?.sets.forEach((set) => {
        if (set.weight !== null && set.weight > bestSetWeight) {
          bestSetWeight = set.weight;
          bestSetReps = set.reps ?? 0;
        }
      });

      return {
        workoutId: w.id,
        workoutName: w.name,
        date: w.date,
        totalSets: workoutExe?.sets.length ?? 0,
        bestSetWeight,
        bestSetReps,
        sets: workoutExe?.sets || [],
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleAddToWorkout = () => {
    if (!activeWorkout) {
      startWorkout("Strength Session");
    }
    addExercise(exercise.id);
    router.push("/workout");
  };

  return (
    <View style={s.root}>
      {/* ── App Header ─────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(350)} style={s.appBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.iconBtn, pressed && s.iconBtnActive]}
        >
          <MaterialIcons name="chevron-left" size={24} color={GOLD} />
        </Pressable>
        <Text style={s.logo}>GRIT PROFILE</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* ── Title Block ── */}
        <Animated.View entering={FadeInDown.delay(60).springify()} style={s.headerContainer}>
          <Text style={s.subtitleLabel}>{exercise.muscleGroup.toUpperCase()} MOVEMENT</Text>
          <Text style={s.mainTitle}>{exercise.name}</Text>
        </Animated.View>

        {/* ── Cover Media Card ── */}
        <Animated.View entering={FadeInDown.delay(120).springify()} style={s.mediaCard}>
          <View style={s.mediaAccentBar} />
          <View style={s.mediaCover}>
            {thumbnailUrl ? (
              <View style={s.imageContainer}>
                <Image source={{ uri: thumbnailUrl }} style={s.coverImage} />
                <Pressable
                  style={s.playOverlay}
                  onPress={() => Linking.openURL(exercise.youtubeUrl)}
                >
                  <View style={s.playBtnCircle}>
                    <MaterialIcons
                      name="play-arrow"
                      size={28}
                      color={DARK_GOLD}
                      style={{ marginLeft: 2 }}
                    />
                  </View>
                </Pressable>
              </View>
            ) : (
              <View style={s.mediaFallback}>
                <View style={s.fallbackGrid} />
                <MaterialIcons name="fitness-center" size={48} color="rgba(253, 228, 0, 0.15)" />
                <Text style={s.fallbackText}>NO VIDEO RESOURCE LINKED</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={s.badgeRow}>
            <View style={[s.badge, exercise.isCustom ? s.badgeCustom : s.badgePreset]}>
              <View style={[s.badgeDot, exercise.isCustom ? s.dotCustom : s.dotPreset]} />
              <Text style={[s.badgeText, exercise.isCustom ? s.textCustom : s.textPreset]}>
                {exercise.isCustom ? "CUSTOM" : "PRESET"}
              </Text>
            </View>
            <View style={[s.badge, s.badgeSecondary]}>
              <MaterialIcons name="layers" size={10} color={TEXT_SUB} style={{ marginRight: 4 }} />
              <Text style={s.badgeTextSecondary}>{exercise.muscleGroup.toUpperCase()}</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Interactive Action Row ── */}
        <View style={s.actionRow}>
          <AnimatedPressable
            style={[s.btnStart, startStyle]}
            onPressIn={() => {
              startScale.value = withSpring(0.93, { damping: 8 });
            }}
            onPressOut={() => {
              startScale.value = withSpring(1, { damping: 12 });
            }}
            onPress={handleAddToWorkout}
          >
            <MaterialIcons name="add" size={18} color={DARK_GOLD} />
            <Text style={s.btnStartText}>ADD TO SESSION</Text>
          </AnimatedPressable>

          {exercise.youtubeUrl ? (
            <AnimatedPressable
              style={[s.btnCustom, videoStyle]}
              onPressIn={() => {
                videoScale.value = withSpring(0.93, { damping: 8 });
              }}
              onPressOut={() => {
                videoScale.value = withSpring(1, { damping: 12 });
              }}
              onPress={() => Linking.openURL(exercise.youtubeUrl)}
            >
              <MaterialIcons
                name="smart-display"
                size={18}
                color={TEXT}
                style={{ marginRight: 4 }}
              />
              <Text style={s.btnCustomText}>WATCH VIDEO</Text>
            </AnimatedPressable>
          ) : null}
        </View>

        {/* ── Performance Stats Grid ── */}
        <Animated.View entering={FadeInDown.delay(180).springify()}>
          <Text style={s.secTitle}>PERFORMANCE PROFILE</Text>
          <View style={s.statsRow}>
            {/* PR Box */}
            <View style={s.statCard}>
              <Text style={s.statLabel}>ALL-TIME PR</Text>
              <Text style={s.statValue}>
                {allTimeMaxWeight > 0 ? `${formatWorkoutValue(allTimeMaxWeight)} kg` : "—"}
              </Text>
              {allTimeMaxWeight > 0 && allTimeMaxWeightReps && (
                <Text style={s.statDetail}>
                  {allTimeMaxWeightReps} reps ·{" "}
                  {(allTimeMaxWeightDate &&
                    formatDateLabel(allTimeMaxWeightDate).split(",")[1]?.trim()) ||
                    allTimeMaxWeightDate}
                </Text>
              )}
            </View>

            {/* Estimated 1RM Box */}
            <View style={s.statCard}>
              <Text style={s.statLabel}>ESTIMATED 1RM</Text>
              <Text style={s.statValue}>{estimated1RM ? `${estimated1RM} kg` : "—"}</Text>
              <Text style={s.statDetail}>Epley formula base</Text>
            </View>

            {/* Consistency Box */}
            <View style={s.statCard}>
              <Text style={s.statLabel}>COMPLETED</Text>
              <Text style={s.statValue}>{exerciseHistory.length}</Text>
              <Text style={s.statDetail}>recorded sessions</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── History Timeline ── */}
        <View style={{ marginTop: 6 }}>
          <Text style={s.secTitle}>LIFTING TIMELINE</Text>

          {exerciseHistory.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(240)} style={s.emptyHistory}>
              <MaterialIcons name="history" size={32} color={BORDER} />
              <Text style={s.emptyHistoryTitle}>No Saved Performance Data</Text>
              <Text style={s.emptyHistorySub}>
                Your logged lifts for this exercise will display as an interactive timeline here.
              </Text>
            </Animated.View>
          ) : (
            <View style={s.timeline}>
              <View style={s.timelineLine} />
              {exerciseHistory.map((item, i) => (
                <Animated.View
                  entering={FadeInRight.delay(i * 60)
                    .springify()
                    .damping(14)}
                  key={item.workoutId}
                  style={s.timelineRow}
                >
                  {/* Dotted Node */}
                  <View style={[s.timelineDot, i === 0 && s.timelineDotActive]} />

                  {/* Workout Card */}
                  <View style={s.historyCard}>
                    <View style={s.historyCardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.historyCardDate}>{formatDateLabel(item.date)}</Text>
                        <Text style={s.historyCardName} numberOfLines={1}>
                          {item.workoutName}
                        </Text>
                      </View>
                      <View style={s.bestSetBadge}>
                        <MaterialIcons
                          name="emoji-events"
                          size={12}
                          color={GOLD}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={s.bestSetBadgeText}>
                          MAX: {item.bestSetWeight}kg{" "}
                          {item.bestSetReps > 0 && `× ${item.bestSetReps}`}
                        </Text>
                      </View>
                    </View>

                    {/* Set details list */}
                    <View style={s.setsGrid}>
                      {item.sets.map((set, setIdx) => (
                        <View key={set.id} style={s.setDetailsPill}>
                          <Text style={s.setDetailsPillIndex}>{setIdx + 1}</Text>
                          <Text style={s.setDetailsPillText}>
                            {set.weight !== null ? `${formatWorkoutValue(set.weight)}kg` : "—"} ×{" "}
                            {set.reps !== null ? set.reps : "—"}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  appBar: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    backgroundColor: DARK_BG,
  },
  logo: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 15,
    color: GOLD,
    letterSpacing: 1.5,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnActive: {
    backgroundColor: "#2a2a2a",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 60,
  },

  // Header Title
  headerContainer: {
    marginBottom: 20,
  },
  subtitleLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: TEXT_SUB,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 22,
    color: TEXT,
    letterSpacing: 0.5,
    lineHeight: 28,
  },

  // Media Cover Card
  mediaCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_R,
    overflow: "hidden",
    marginBottom: 20,
  },
  mediaAccentBar: {
    height: 3,
    backgroundColor: GOLD,
  },
  mediaCover: {
    height: 220,
    backgroundColor: SURFACE_HIGH,
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  mediaFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "relative",
  },
  fallbackGrid: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: "rgba(253, 228, 0, 0.03)",
    borderStyle: "dashed",
  },
  fallbackText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 11,
    color: TEXT_DIM,
    letterSpacing: 1.5,
    marginTop: 10,
  },

  // Badge Row
  badgeRow: {
    flexDirection: "row",
    padding: 14,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgePreset: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: BORDER,
  },
  badgeCustom: {
    backgroundColor: "rgba(253, 228, 0, 0.05)",
    borderColor: "rgba(253, 228, 0, 0.25)",
  },
  badgeSecondary: {
    backgroundColor: SURFACE_HIGH,
    borderColor: BORDER,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotPreset: {
    backgroundColor: TEXT_SUB,
  },
  dotCustom: {
    backgroundColor: GOLD,
  },
  badgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  textPreset: {
    color: TEXT_SUB,
  },
  textCustom: {
    color: GOLD,
  },
  badgeTextSecondary: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: TEXT,
    letterSpacing: 0.5,
  },

  // Interactive Action Row
  actionRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 10,
  },
  btnStart: {
    flex: 1,
    backgroundColor: GOLD,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnStartText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 12,
    color: DARK_GOLD,
    letterSpacing: 1.2,
    marginLeft: 6,
  },
  btnCustom: {
    flex: 1,
    backgroundColor: SURFACE_HIGH,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCustomText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 12,
    color: TEXT,
    letterSpacing: 1,
  },

  // Section Headers
  secTitle: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 13,
    color: TEXT,
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 10,
  },

  // Performance Stats Bento Grid
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_R,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: TEXT_DIM,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 6,
  },
  statValue: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 16,
    color: GOLD,
    textAlign: "center",
  },
  statDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    color: TEXT_SUB,
    textAlign: "center",
    marginTop: 4,
  },

  // Empty Performance State
  emptyHistory: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: SURFACE,
    borderRadius: CARD_R,
    borderWidth: 1,
    borderColor: BORDER,
  },
  emptyHistoryTitle: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 14,
    color: TEXT_SUB,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyHistorySub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: TEXT_DIM,
    textAlign: "center",
    lineHeight: 16,
  },

  // Empty Screen Root
  emptyRoot: {
    flex: 1,
    backgroundColor: DARK_BG,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_R,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 16,
    color: TEXT,
    marginTop: 14,
    marginBottom: 6,
    textAlign: "center",
  },
  emptySub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: TEXT_SUB,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  backBtnPreset: {
    backgroundColor: GOLD,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnPresetText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 12,
    color: DARK_GOLD,
    letterSpacing: 1.2,
  },

  // Timeline
  timeline: {
    paddingLeft: 18,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 4,
    top: 24,
    bottom: 24,
    width: 1,
    backgroundColor: BORDER,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    position: "relative",
  },
  timelineDot: {
    position: "absolute",
    left: -18,
    top: 18,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: SURFACE_HIGH,
    borderWidth: 1.5,
    borderColor: BORDER,
    zIndex: 2,
  },
  timelineDotActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },

  // History Card
  historyCard: {
    flex: 1,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_R,
    padding: 14,
  },
  historyCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    paddingBottom: 10,
    marginBottom: 10,
  },
  historyCardDate: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: TEXT_SUB,
    marginBottom: 2,
  },
  historyCardName: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 13,
    color: TEXT,
  },
  bestSetBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(253, 228, 0, 0.08)",
    borderWidth: 0.5,
    borderColor: "rgba(253, 228, 0, 0.2)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  bestSetBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: GOLD,
    letterSpacing: 0.5,
  },

  // Sets Grid
  setsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  setDetailsPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE_HIGH,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  setDetailsPillIndex: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: TEXT_DIM,
    marginRight: 6,
  },
  setDetailsPillText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 11,
    color: TEXT,
  },
});

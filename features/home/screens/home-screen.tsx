import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useHomeStore } from "@/store/use-home-store";
import { useHistoryStore } from "@/store/use-history-store";
import { formatDuration } from "@/utils/workout";

const { width: SCREEN_W } = Dimensions.get("window");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Constants ───────────────────────────────────────────────────────────────
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
const H_PAD = 16;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

// ─── StatCard ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string | number;
  delay?: number;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(14)}
      style={[s.statWrap, anim]}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 8 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        style={s.statCard}
      >
        <Text style={s.statLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={s.statValue} numberOfLines={1}>
          {String(value)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── CalendarDay ─────────────────────────────────────────────────────────────
function CalendarDay({
  dayName,
  dateNum,
  hasWorkout,
  isToday,
  delay = 0,
}: {
  dayName: string;
  dateNum: number;
  hasWorkout: boolean;
  isToday: boolean;
  delay?: number;
}) {
  const opacity = useSharedValue(hasWorkout ? 0 : 1);

  useEffect(() => {
    if (hasWorkout) {
      opacity.value = withSequence(
        withDelay(delay + 300, withTiming(1, { duration: 400 })),
        withTiming(0.7, { duration: 600 }),
      );
    }
  }, [hasWorkout, delay, opacity]);

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={s.calDay}>
      <Text style={[s.calDayLabel, isToday && s.calDayLabelToday]}>{dayName}</Text>
      <View
        style={[s.calDot, hasWorkout && s.calDotFilled, isToday && !hasWorkout && s.calDotToday]}
      >
        <Text style={[s.calDotText, hasWorkout && s.calDotTextDark]}>{dateNum}</Text>
      </View>
    </Animated.View>
  );
}

// ─── WorkoutCard ─────────────────────────────────────────────────────────────
type WorkoutEntry = {
  id: string;
  name: string;
  date: string;
  totalVolume: number;
  durationSeconds: number;
  setCount: number;
};

function WorkoutCard({
  workout,
  index,
  onPress,
}: {
  workout: WorkoutEntry;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80)
        .springify()
        .damping(14)}
      style={[s.wCard, anim]}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 10 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        onPress={onPress}
        style={s.wCardInner}
      >
        <View style={s.wCardTop}>
          <Text style={s.wCardName} numberOfLines={1}>
            {workout.name}
          </Text>
          <Text style={s.wCardDate}>{workout.date}</Text>
        </View>
        <View style={s.wCardMeta}>
          <View>
            <Text style={s.metaLbl}>VOLUME</Text>
            <Text style={[s.metaVal, index === 0 && s.metaValGold]}>
              {workout.totalVolume.toLocaleString()} kg
            </Text>
          </View>
          <View>
            <Text style={s.metaLbl}>DURATION</Text>
            <Text style={s.metaVal}>{Math.round(workout.durationSeconds / 60)} min</Text>
          </View>
          <View>
            <Text style={s.metaLbl}>SETS</Text>
            <Text style={s.metaVal}>{workout.setCount}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── QuickBtn ─────────────────────────────────────────────────────────────────
function QuickBtn({
  icon,
  label,
  onPress,
  delay = 0,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  onPress: () => void;
  delay?: number;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={[s.qCard, anim]}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.91, { damping: 8 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        onPress={onPress}
        style={s.qInner}
      >
        <MaterialIcons name={icon} size={24} color={GOLD} />
        <Text style={s.qLabel} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── HomeScreen ──────────────────────────────────────────────────────────────
export function HomeScreen() {
  const router = useRouter();
  const userName = useHomeStore((state) => state.userName);
  const workouts = useHistoryStore((state) => state.workouts);

  const activeDays = new Set(workouts.map((w) => w.date)).size;
  const activeSecs = workouts.reduce((sum, w) => sum + w.durationSeconds, 0);

  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0] ?? "";
    return {
      dayName: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()] ?? "S",
      dateNum: d.getDate(),
      dateStr: ds,
      hasWorkout: workouts.some((w) => w.date === ds),
      isToday: ds === todayStr,
    };
  });

  const startScale = useSharedValue(1);
  const startStyle = useAnimatedStyle(() => ({ transform: [{ scale: startScale.value }] }));
  const customScale = useSharedValue(1);
  const customStyle = useAnimatedStyle(() => ({ transform: [{ scale: customScale.value }] }));

  return (
    <View style={s.root}>
      {/* ── App Bar ─────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(350)} style={s.appBar}>
        <Text style={s.logo}>FORGE</Text>
        <View style={s.appBarEnd}>
          <Pressable
            onPress={() => router.push("/library")}
            style={({ pressed }) => [s.iconBtn, pressed && s.iconBtnActive]}
          >
            <MaterialIcons name="search" size={22} color={TEXT_SUB} />
          </Pressable>
          <View style={s.avatar}>
            <Text style={s.avatarLetter}>{userName?.charAt(0)?.toUpperCase() ?? "J"}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* ── Greeting ── */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <Text style={s.greetSub}>Good {getGreeting()}</Text>
          <Text style={s.greetName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            {userName ?? "Athlete"}
          </Text>
        </Animated.View>

        {/* ── Stats Row ── */}
        <View style={s.statsRow}>
          <StatCard label="Active Days" value={activeDays} delay={120} />
          <StatCard label="Active Time" value={formatDuration(activeSecs)} delay={170} />
          <StatCard label="Workouts" value={workouts.length} delay={220} />
        </View>

        {/* ── 7-Day Calendar ── */}
        <Animated.View entering={FadeInDown.delay(270).springify()} style={s.calCard}>
          <Text style={s.chipLabel}>THIS WEEK</Text>
          <View style={s.calRow}>
            {week.map((day, i) => (
              <CalendarDay
                key={day.dateStr}
                dayName={day.dayName}
                dateNum={day.dateNum}
                hasWorkout={day.hasWorkout}
                isToday={day.isToday}
                delay={i * 40}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── Start Training Card ── */}
        <Animated.View entering={FadeInDown.delay(340).springify()} style={s.heroCard}>
          <View style={s.heroBar} />
          <View style={s.heroPad}>
            <View style={s.heroHead}>
              <View style={s.heroLeft}>
                <Text style={s.heroTitle} numberOfLines={1}>
                  Push Day A
                </Text>
                <Text style={s.heroSub} numberOfLines={2}>
                  Chest · Shoulders · Triceps • 6 Exercises
                </Text>
              </View>
              <View style={s.heroBadge}>
                <Text style={s.heroBadgeText}>STRENGTH</Text>
              </View>
            </View>
            <View style={s.heroBtns}>
              <AnimatedPressable
                style={[s.btnStart, startStyle]}
                onPressIn={() => {
                  startScale.value = withSpring(0.93, { damping: 8 });
                }}
                onPressOut={() => {
                  startScale.value = withSpring(1, { damping: 12 });
                }}
                onPress={() => router.push("/workout")}
              >
                <MaterialIcons name="play-arrow" size={18} color={DARK_GOLD} />
                <Text style={s.btnStartText}>START ROUTINE</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[s.btnCustom, customStyle]}
                onPressIn={() => {
                  customScale.value = withSpring(0.93, { damping: 8 });
                }}
                onPressOut={() => {
                  customScale.value = withSpring(1, { damping: 12 });
                }}
                onPress={() => router.push("/library")}
              >
                <Text style={s.btnCustomText}>CUSTOM</Text>
              </AnimatedPressable>
            </View>
          </View>
        </Animated.View>

        {/* ── Recent Workouts ── */}
        <View>
          <View style={s.secHead}>
            <Text style={s.secTitle}>Recent</Text>
            <Pressable
              onPress={() => router.push("/history")}
              style={({ pressed }) => [pressed && { opacity: 0.5 }]}
            >
              <Text style={s.viewAll}>View All →</Text>
            </Pressable>
          </View>

          {workouts.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(430)} style={s.empty}>
              <MaterialIcons name="fitness-center" size={34} color={BORDER} />
              <Text style={s.emptyTitle}>No workouts yet</Text>
              <Text style={s.emptySub}>Start your first session to see history</Text>
            </Animated.View>
          ) : (
            <View style={s.timeline}>
              <View style={s.timelineLine} />
              {workouts.slice(0, 4).map((w, i) => (
                <View key={w.id} style={s.timelineRow}>
                  <View style={[s.dot, i === 0 && s.dotActive]} />
                  <WorkoutCard
                    workout={w}
                    index={i}
                    onPress={() => router.push(`/history/${w.id}`)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Quick Actions ── */}
        <Animated.View entering={FadeInDown.delay(490).springify()}>
          <Text style={[s.secTitle, { marginBottom: 12 }]}>Quick Actions</Text>
          <View style={s.qRow}>
            <QuickBtn
              icon="history"
              label="History"
              delay={0}
              onPress={() => router.push("/history")}
            />
            <QuickBtn
              icon="library-books"
              label="Library"
              delay={60}
              onPress={() => router.push("/library")}
            />
            <QuickBtn
              icon="bar-chart"
              label="Stats"
              delay={120}
              onPress={() => router.push("/stats" as any)}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK_BG },

  // App Bar
  appBar: {
    height: 58,
    paddingHorizontal: H_PAD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    backgroundColor: DARK_BG,
  },
  logo: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 17,
    color: GOLD,
    letterSpacing: 1.5,
  },
  appBarEnd: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 8, borderRadius: 8, marginRight: 6 },
  iconBtnActive: { backgroundColor: "#2a2a2a" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { fontFamily: "ArchivoNarrow_700Bold", fontSize: 13, color: DARK_GOLD },

  // Scroll
  scroll: {
    paddingHorizontal: H_PAD,
    paddingTop: 20,
    paddingBottom: 110,
  },

  // Greeting
  greetSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: TEXT_SUB,
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  greetName: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 20,
    color: TEXT,
    letterSpacing: 0.5,
    maxWidth: SCREEN_W - H_PAD * 2,
    marginBottom: 22,
  },

  // Stats
  statsRow: { flexDirection: "row", marginBottom: 18 },
  statWrap: { flex: 1, marginHorizontal: 3 },
  statCard: {
    backgroundColor: SURFACE_HIGH,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_R,
    paddingVertical: 13,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: TEXT_SUB,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 5,
  },
  statValue: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 17,
    color: GOLD,
    textAlign: "center",
  },

  // Calendar
  calCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_R,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    marginBottom: 18,
  },
  chipLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: TEXT_DIM,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  calRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calDay: { alignItems: "center" },
  calDayLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: TEXT_DIM,
    marginBottom: 6,
  },
  calDayLabelToday: { color: GOLD },
  calDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  calDotFilled: {
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 7,
    elevation: 5,
  },
  calDotToday: { borderWidth: 1, borderColor: GOLD },
  calDotText: { fontFamily: "ArchivoNarrow_700Bold", fontSize: 12, color: TEXT_SUB },
  calDotTextDark: { color: DARK_GOLD },

  // Hero Card
  heroCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: CARD_R,
    overflow: "hidden",
    marginBottom: 22,
  },
  heroBar: { height: 3, backgroundColor: GOLD },
  heroPad: { padding: 16 },
  heroHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heroLeft: { flex: 1, marginRight: 12 },
  heroTitle: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 15,
    color: GOLD,
    letterSpacing: 0.3,
    marginBottom: 5,
  },
  heroSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: TEXT_SUB,
    lineHeight: 16,
  },
  heroBadge: {
    borderWidth: 1,
    borderColor: "rgba(253,228,0,0.4)",
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 4,
    flexShrink: 0,
  },
  heroBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: GOLD,
    letterSpacing: 1.2,
  },
  heroBtns: { flexDirection: "row" },
  btnStart: {
    flex: 1,
    backgroundColor: GOLD,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  btnStartText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 12,
    color: DARK_GOLD,
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  btnCustom: {
    flex: 1,
    backgroundColor: SURFACE_HIGH,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCustomText: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 12,
    color: TEXT,
    letterSpacing: 1,
  },

  // Section header
  secHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  secTitle: {
    fontFamily: "SpecialGothicExpandedOne_400Regular",
    fontSize: 14,
    color: TEXT,
    letterSpacing: 0.3,
  },
  viewAll: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: GOLD },

  // Empty state
  empty: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: SURFACE,
    borderRadius: CARD_R,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 22,
  },
  emptyTitle: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 15,
    color: TEXT_DIM,
    marginTop: 10,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: BORDER,
    textAlign: "center",
    paddingHorizontal: 24,
  },

  // Timeline
  timeline: { paddingLeft: 24, marginBottom: 22 },
  timelineLine: {
    position: "absolute",
    left: 5,
    top: 16,
    bottom: 16,
    width: 2,
    backgroundColor: BORDER,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  dot: {
    position: "absolute",
    left: -19,
    top: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: SURFACE_HIGH,
    borderWidth: 2,
    borderColor: TEXT_DIM,
    zIndex: 2,
  },
  dotActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },

  // Workout Card
  wCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    overflow: "hidden",
  },
  wCardInner: { padding: 13 },
  wCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  wCardName: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 14,
    color: TEXT,
    flex: 1,
    marginRight: 8,
  },
  wCardDate: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: TEXT_DIM,
    flexShrink: 0,
  },
  wCardMeta: { flexDirection: "row" },
  metaLbl: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: TEXT_DIM,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaVal: {
    fontFamily: "ArchivoNarrow_700Bold",
    fontSize: 13,
    color: TEXT,
    marginRight: 16,
  },
  metaValGold: { color: GOLD },

  // Quick Buttons
  qRow: { flexDirection: "row" },
  qCard: {
    flex: 1,
    backgroundColor: SURFACE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    marginHorizontal: 3,
  },
  qInner: {
    paddingVertical: 15,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  qLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: TEXT_SUB,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 6,
  },
});

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState, memo, type ReactNode } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Vibration,
  View,
} from "react-native";
import { PremiumHeader, AppText } from "@/components";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHistoryStore } from "@/store/use-history-store";
import { useWorkoutStore } from "@/store/use-workout-store";
import { getWeekStart, toIsoDate, getTodayDefaultWorkoutName } from "@/utils/workout";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#E5C158";
const BG_DARK = "#0F0F0F";
const GLASS_BG = "rgba(28, 28, 28, 0.8)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.08)";
const TEXT_MAIN = "#E5E2E1";
const TEXT_MUTED = "#A0A0A0";
const ACCENT_GREEN = "#4AE176";

const BG_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLu24nWykqZgevYWrQMAhU9O5LgBS6uhrv8kZkt-qWLqrh5ajV_SDAiglamnC3NvDMH372x4edKvbx-k-j25zf8loO3IpIH3g7jM30OqlaJ2uKaJCG4QX00E_wGUNrrE40-OQguDWv4lOa1w3f_83zHHR0vrk2-8bRDM3D9-V6CLshfW3OKB5q5wee_qT1yPfdtHL_YUU3tq5YfS0gCMGjqORk8K2HKT9bwdoeqgTW0bhM_XHw44gEaW9xg";
const BG_PATTERN_OVERLAY =
  "https://lh3.googleusercontent.com/aida/AP1WRLuF0eRL9PCMph4Zj755O_n42jVLK-BqtvU2PyCWoY_bl8GLgdfgTZ9NNQH25m3FjrrA0uZQT4fUfUR6t5ycREAzDR16XrX55UzRVxSEMDIeEIMx1pL1IrPUH4IZZ44CBEky-rBaMYUD-slms2jqlRBTXZqiZ_lMQOalXwLptSGMJA1vOA5rOaF13R9oBZF6PxRT-Bngvci6u-bqj-Te8YOULhF-mEI_uTL-wq7PCWh0ytfAFyVsZVzl5w";
const AVATAR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBFYjvh7gzy6AiKmPJTpZZ_wFDahPj0dmlx-e1U_rbZWImwLsPNZ5Rx6t45WbPNrPkKyA2d-yHDUb0TGQxfT284KfPsI0WfKR5LcHGeC0DBjI6mJLU78LcuXXjp6tYPEjuABSy1ztkPKmA_gTbPFYzILTZUTNsKdLjZRVEyULOJWiZrIbSvfCBIHMV6wiSjk8tl1fVuvSlkZTX_Gm2uYc7Dq95ln5caLCCVw8LhZGqhDTfHCYvA8QLvriApsx-wAs53I4KnX96mk8U";

function formatTimer(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function parseSafeDate(dateString: string | null | undefined) {
  if (!dateString) return null;

  const candidates = [`${dateString}T00:00:00`, dateString];
  for (const candidate of candidates) {
    const date = new Date(candidate);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

function formatWeekRange(startDate: Date, endDate: Date) {
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "AUG 22 - 28";
  }

  const month = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format(startDate)
    .toUpperCase();
  const endMonth = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format(endDate)
    .toUpperCase();
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  return month === endMonth
    ? `${month} ${startDay} - ${endDay}`
    : `${month} ${startDay} - ${endMonth} ${endDay}`;
}

function formatWorkoutHeadline(name: string) {
  const normalized = name.trim();
  const shortName = normalized.includes("-")
    ? (normalized.split("-").pop()?.trim() ?? normalized)
    : normalized;
  if (/leg/i.test(shortName)) return "LEG DAY";
  if (/pull/i.test(shortName)) return "PULL DAY";
  if (/push/i.test(shortName)) return "PUSH DAY";
  return shortName.toUpperCase();
}

function formatWorkoutDateLabel(dateString: string) {
  const date = parseSafeDate(dateString);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
    .format(date)
    .toUpperCase();
}

const LAYOUT_KEYS = new Set([
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginHorizontal",
  "marginVertical",
  "position",
  "top",
  "bottom",
  "left",
  "right",
  "zIndex",
  "alignSelf",
]);

function splitStyles(style: any) {
  const outerStyle: any = {};
  const innerStyle: any = {};

  if (!style) return { outerStyle, innerStyle };

  const flatten = StyleSheet.flatten(style);
  for (const key in flatten) {
    if (LAYOUT_KEYS.has(key)) {
      outerStyle[key] = flatten[key];
    } else {
      innerStyle[key] = flatten[key];
    }
  }

  return { outerStyle, innerStyle };
}

function PressScaleCard({
  children,
  onPress,
  style,
  delay = 0,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: any;
  delay?: number;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    Vibration.vibrate(5);
    scale.value = withSpring(0.96, { damping: 12, stiffness: 260 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 220 });
  };

  const { outerStyle, innerStyle } = splitStyles(style);
  const hasLayout = Object.keys(outerStyle).some((key) =>
    ["width", "height", "minWidth", "minHeight", "flex", "flexGrow", "flexBasis"].includes(key),
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[animatedStyle, hasLayout ? outerStyle : null]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[s.card, hasLayout ? innerStyle : style, hasLayout && { width: "100%", flex: 1 }]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function GlowingDivider() {
  return (
    <LinearGradient
      colors={["transparent", "rgba(212, 175, 55, 0.14)", "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={s.divider}
    />
  );
}

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

function CompletedWorkoutDay({ delay = 0 }: { delay?: number }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.3, { duration: 1600 }), -1, true);
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: ((1.3 - pulse.value) / 0.3) * 0.4,
  }));

  return (
    <View style={s.calendarWorkoutContainer}>
      <Animated.View style={[s.calendarWorkoutGlow, glowStyle]} />
      <View style={s.calendarWorkoutFlashRing}>
        <MaterialIcons name="flash-on" size={18} color={GOLD} />
      </View>
    </View>
  );
}

function TodayActiveDay({ dateNum }: { dateNum: number }) {
  const todayPulse = useSharedValue(1);

  useEffect(() => {
    todayPulse.value = withRepeat(withTiming(1.06, { duration: 2000 }), -1, true);
  }, [todayPulse]);

  const todayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: todayPulse.value }],
  }));

  return (
    <Animated.View style={[s.calendarTodayRing, todayStyle]}>
      <AppText variant="caption" style={s.calendarTodayText}>
        {dateNum}
      </AppText>
    </Animated.View>
  );
}

function NoWorkoutDay() {
  return (
    <View style={s.calendarEmptyRing}>
      <View style={s.calendarEmptyDot} />
    </View>
  );
}

function CalendarDay({
  dayLabel,
  dateNum,
  hasWorkout,
  isToday,
  delay = 0,
}: {
  dayLabel: string;
  dateNum: number;
  hasWorkout: boolean;
  isToday: boolean;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={s.calendarItem}>
      <AppText variant="caption" style={[s.calendarLabel, isToday && s.calendarLabelToday]}>
        {dayLabel}
      </AppText>
      {hasWorkout ? (
        <CompletedWorkoutDay delay={delay} />
      ) : isToday ? (
        <TodayActiveDay dateNum={dateNum} />
      ) : (
        <NoWorkoutDay />
      )}
    </Animated.View>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const isCompact = width < 390;

  const workouts = useHistoryStore((state) => state.workouts);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeWorkout) {
      setElapsed(0);
      return;
    }

    const tick = () => {
      const started = new Date(activeWorkout.startedAt).getTime();
      setElapsed(Math.max(0, Math.round((Date.now() - started) / 1000)));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  const sortedWorkouts = useMemo(
    () => [...workouts].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    [workouts],
  );

  const latestWorkout = sortedWorkouts[0] ?? null;
  const yesterdayWorkout = useMemo(() => {
    const yesterdayIso = toIsoDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    return (
      sortedWorkouts.find((workout) => workout.date === yesterdayIso) ??
      sortedWorkouts[1] ??
      latestWorkout
    );
  }, [latestWorkout, sortedWorkouts]);

  const weekDays = useMemo(() => {
    const referenceDate = new Date();
    const weekStart = getWeekStart(referenceDate);
    const todayIso = toIsoDate(referenceDate);

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      const iso = toIsoDate(day);

      return {
        iso,
        dayLabel: ["M", "T", "W", "T", "F", "S", "S"][index] ?? "M",
        dateNum: day.getDate(),
        hasWorkout: sortedWorkouts.some((workout) => workout.date === iso),
        isToday: iso === todayIso,
      };
    });
  }, [sortedWorkouts]);

  const weekRangeLabel = useMemo(() => {
    if (weekDays.length === 0) {
      return "AUG 22 - 28";
    }

    const start = parseSafeDate(weekDays[0]?.iso) ?? new Date();
    const end = parseSafeDate(weekDays[6]?.iso) ?? new Date();
    return formatWeekRange(start, end);
  }, [weekDays]);

  const todayDate = toIsoDate();
  const todayWorkout = useMemo(
    () => sortedWorkouts.find((workout) => workout.date === todayDate) ?? null,
    [todayDate, sortedWorkouts],
  );

  const sessionTitle = activeWorkout
    ? formatWorkoutHeadline(activeWorkout.name)
    : todayWorkout
      ? formatWorkoutHeadline(todayWorkout.name)
      : "STRENGTH SESSION";

  const sessionProgress = activeWorkout
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            (activeWorkout.exercises.filter((exercise) =>
              exercise.sets.some((set) => set.isCompleted),
            ).length /
              Math.max(1, activeWorkout.exercises.length)) *
              100,
          ),
        ),
      )
    : todayWorkout
      ? 100
      : 0;

  const activeCompletedCount = activeWorkout
    ? activeWorkout.exercises.filter((ex) => ex.sets.every((s) => s.isCompleted)).length
    : 0;
  const activeTotalCount = activeWorkout ? activeWorkout.exercises.length : 0;

  const sessionExerciseBadge = activeWorkout
    ? `EXERCISE ${activeCompletedCount}/${activeTotalCount}`
    : todayWorkout
      ? `EXERCISES: ${todayWorkout.exerciseCount}`
      : "READY";

  const sessionTimer = activeWorkout
    ? formatTimer(elapsed)
    : todayWorkout
      ? formatTimer(todayWorkout.durationSeconds)
      : "00:00";

  const sessionTimerLabel = activeWorkout
    ? "ELAPSED TIME"
    : todayWorkout
      ? "TOTAL DURATION"
      : "NOT STARTED";

  const sessionCaption = activeWorkout
    ? "ACTIVE SESSION"
    : todayWorkout
      ? "TODAY'S SESSION"
      : "NEXT SESSION";

  const sessionActionText = activeWorkout
    ? "CONTINUE SESSION"
    : todayWorkout
      ? "VIEW TODAY'S SUMMARY"
      : "START NEW SESSION";

  const yesterdayMinutes = yesterdayWorkout
    ? Math.round(yesterdayWorkout.durationSeconds / 60)
    : 68;
  const yesterdaySets = yesterdayWorkout ? yesterdayWorkout.setCount : 18;
  const yesterdayVolume = yesterdayWorkout
    ? yesterdayWorkout.totalVolume.toLocaleString()
    : "12,450";

  const recentSessions = sortedWorkouts.slice(0, 2);

  const handleStartSession = () => {
    const defaultName = getTodayDefaultWorkoutName();
    startWorkout(defaultName);
    router.push("/workout");
  };

  return (
    <View style={s.root}>
      <Image source={{ uri: BG_HERO_IMAGE }} resizeMode="cover" style={s.backgroundImage} />
      <Image source={{ uri: BG_PATTERN_OVERLAY }} resizeMode="cover" style={s.patternOverlay} />
      <LinearGradient
        colors={["rgba(15, 15, 15, 0.4)", "rgba(15, 15, 15, 0.88)"]}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill}
      />
      <GoldDustParticles />

      <View style={[s.contentFrame, { paddingTop: insets.top + 14 }]}>
        <ScrollView
          ref={scrollRef}
          style={s.scrollViewport}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            s.scrollContent,
            isCompact && s.scrollContentCompact,
            { paddingBottom: 106 + Math.max(insets.bottom, 16) },
          ]}
        >
          <PremiumHeader
            title="Dashboard"
            leftIcon="menu"
            onLeftPress={() => {}}
            right={
              <Pressable
                onPress={() => router.push("/profile")}
                style={({ pressed }) => [s.avatarWrap, pressed && s.avatarPressed]}
              >
                <View style={s.avatarRing}>
                  <Image source={{ uri: AVATAR_IMAGE }} style={s.avatar} />
                </View>
                <View style={s.avatarBadge}>
                  <AppText variant="caption" style={s.avatarBadgeText}>
                    14
                  </AppText>
                </View>
              </Pressable>
            }
          />

          <PressScaleCard
            onPress={
              activeWorkout
                ? () => router.push("/workout")
                : todayWorkout
                  ? () => router.push(`/history/${todayWorkout.id}`)
                  : handleStartSession
            }
            style={[s.heroCard, isCompact && s.heroCardCompact]}
          >
            <View style={s.heroTopRow}>
              <View style={s.heroLeftCol}>
                <AppText variant="caption" style={s.heroCaption}>
                  {sessionCaption}
                </AppText>
                <View style={s.heroTitleRow}>
                  <AppText
                    numberOfLines={1}
                    variant="display"
                    style={[s.heroTitle, isCompact && s.heroTitleCompact]}
                  >
                    {sessionTitle}
                  </AppText>
                  {activeWorkout && <View style={s.statusPulse} />}
                  {todayWorkout && !activeWorkout && (
                    <View style={[s.statusPulse, { backgroundColor: GOLD, shadowColor: GOLD }]} />
                  )}
                  {!activeWorkout && !todayWorkout && (
                    <View
                      style={[
                        s.statusPulse,
                        { backgroundColor: "rgba(255, 255, 255, 0.2)", shadowColor: "transparent" },
                      ]}
                    />
                  )}
                </View>
              </View>

              <View style={s.exerciseBadge}>
                <View
                  style={[
                    s.exerciseBadgeDot,
                    !activeWorkout &&
                      !todayWorkout && {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        shadowColor: "transparent",
                      },
                  ]}
                />
                <AppText variant="caption" style={s.exerciseBadgeText}>
                  {sessionExerciseBadge}
                </AppText>
              </View>
            </View>

            <View style={[s.timerCard, isCompact && s.timerCardCompact]}>
              <MaterialIcons name="timer" size={18} color="rgba(212, 175, 55, 0.2)" />
              <AppText variant="display" style={[s.timerText, isCompact && s.timerTextCompact]}>
                {sessionTimer.split(":")[0]}:
                <AppText variant="display" style={s.timerAccent}>
                  {sessionTimer.split(":")[1]}
                </AppText>
              </AppText>
              <AppText variant="caption" style={s.timerLabel}>
                {sessionTimerLabel}
              </AppText>
            </View>

            <View style={s.progressBlock}>
              <View style={s.progressRow}>
                <AppText variant="caption" style={s.progressLabel}>
                  PROGRESS
                </AppText>
                <AppText variant="statValue" style={s.progressValue}>
                  {sessionProgress}%
                </AppText>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[GOLD_LIGHT, GOLD, GOLD_LIGHT]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[s.progressFill, { width: `${sessionProgress}%` }]}
                />
              </View>
            </View>

            <View style={s.continueRow}>
              <AppText variant="caption" style={s.continueText}>
                {sessionActionText}
              </AppText>
              <MaterialIcons name="chevron-right" size={12} color={TEXT_MAIN} />
            </View>
          </PressScaleCard>

          <GlowingDivider />

          <View style={s.section}>
            <View style={[s.sectionHeaderRow, { marginBottom: 8 }]}>
              <AppText
                variant="sectionTitle"
                style={[s.sectionTitle, isCompact && s.sectionTitleCompact]}
              >
                WEEKLY PROGRESS
              </AppText>
              <AppText variant="caption" style={[s.sectionMeta, isCompact && s.sectionMetaCompact]}>
                {weekRangeLabel}
              </AppText>
            </View>

            <View style={s.calendarRow}>
              {weekDays.map((day, index) => (
                <CalendarDay
                  key={day.iso}
                  dayLabel={day.dayLabel}
                  dateNum={day.dateNum}
                  hasWorkout={day.hasWorkout}
                  isToday={day.isToday}
                  delay={index * 60}
                />
              ))}
            </View>
          </View>

          <GlowingDivider />

          <View style={s.section}>
            <AppText
              variant="display"
              style={[s.yesterdayTitle, isCompact && s.yesterdayTitleCompact]}
            >
              YESTERDAY
            </AppText>
            <PressScaleCard
              onPress={() =>
                yesterdayWorkout
                  ? router.push(`/history/${yesterdayWorkout.id}`)
                  : router.push("/history")
              }
              style={s.yesterdayCard}
            >
              <View style={s.yesterdayTopRow}>
                <View style={s.yesterdayLeft}>
                  <View style={s.yesterdayIconWrap}>
                    <MaterialIcons name="vertical-align-bottom" size={24} color={GOLD} />
                  </View>
                  <View style={s.yesterdayCopy}>
                    <AppText
                      variant="body"
                      numberOfLines={1}
                      style={[s.yesterdayWorkoutTitle, isCompact && s.yesterdayWorkoutTitleCompact]}
                    >
                      {yesterdayWorkout ? formatWorkoutHeadline(yesterdayWorkout.name) : "PULL DAY"}
                    </AppText>
                    <View style={s.completedRow}>
                      <View style={s.completedDot} />
                      <AppText variant="caption" style={s.completedText}>
                        COMPLETED
                      </AppText>
                    </View>
                  </View>
                </View>

                <View style={s.yesterdayChevron}>
                  <MaterialIcons name="chevron-right" size={20} color={GOLD} />
                </View>
              </View>

              <View style={s.dividerLine} />

              <View style={s.yesterdayStats}>
                <View style={s.yesterdayStat}>
                  <AppText
                    variant="statValue"
                    style={[s.yesterdayStatValue, isCompact && s.yesterdayStatValueCompact]}
                  >
                    {yesterdayMinutes}
                  </AppText>
                  <AppText variant="caption" style={s.yesterdayStatLabel}>
                    MIN
                  </AppText>
                </View>
                <View style={s.statDivider} />
                <View style={s.yesterdayStat}>
                  <AppText
                    variant="statValue"
                    style={[s.yesterdayStatValue, isCompact && s.yesterdayStatValueCompact]}
                  >
                    {yesterdaySets}
                  </AppText>
                  <AppText variant="caption" style={s.yesterdayStatLabel}>
                    SETS
                  </AppText>
                </View>
                <View style={s.statDivider} />
                <View style={s.yesterdayStat}>
                  <AppText
                    variant="statValue"
                    style={[s.yesterdayStatValue, isCompact && s.yesterdayStatValueCompact]}
                  >
                    {yesterdayVolume}
                  </AppText>
                  <AppText variant="caption" style={s.yesterdayStatLabel}>
                    KG
                  </AppText>
                </View>
              </View>
            </PressScaleCard>
          </View>

          <GlowingDivider />

          <View style={s.section}>
            <View style={[s.sectionHeaderRow, { marginBottom: 20 }]}>
              <AppText
                variant="display"
                style={[
                  s.yesterdayTitle,
                  isCompact && s.yesterdayTitleCompact,
                  { marginBottom: 0 },
                ]}
              >
                RECENT SESSIONS
              </AppText>
              <Pressable onPress={() => router.push("/history")}>
                <MaterialIcons name="arrow-forward" size={24} color="rgba(212, 175, 55, 0.7)" />
              </Pressable>
            </View>

            <View style={s.recentList}>
              {(recentSessions.length > 0 ? recentSessions : [null, null]).map((workout, index) => {
                const fallback =
                  index === 0
                    ? {
                        title: "LEG DAY",
                        date: "AUG 22",
                        duration: "72 MIN",
                        volume: "14,200 KG",
                        trend: "+2% VOL",
                        trendColor: ACCENT_GREEN,
                      }
                    : {
                        title: "UPPER BODY",
                        date: "AUG 20",
                        duration: "58 MIN",
                        volume: "9,800 KG",
                        trend: "ON TRACK",
                        trendColor: TEXT_MUTED,
                      };

                const title = workout ? formatWorkoutHeadline(workout.name) : fallback.title;
                const date = workout ? formatWorkoutDateLabel(workout.startedAt) : fallback.date;
                const duration = workout
                  ? `${Math.round(workout.durationSeconds / 60)} MIN`
                  : fallback.duration;
                const volume = workout
                  ? `${workout.totalVolume.toLocaleString()} KG`
                  : fallback.volume;
                const trendText = index === 0 ? "+2% VOL" : "ON TRACK";
                const trendColor = index === 0 ? ACCENT_GREEN : TEXT_MUTED;

                return (
                  <PressScaleCard
                    key={workout?.id ?? `fallback-${index}`}
                    onPress={() =>
                      workout ? router.push(`/history/${workout.id}`) : router.push("/history")
                    }
                    style={[s.recentCard, isCompact && s.recentCardCompact]}
                    delay={index * 70}
                  >
                    <View style={[s.recentLeft, isCompact && s.recentLeftCompact]}>
                      <View style={[s.recentIconWrap, isCompact && s.recentIconWrapCompact]}>
                        <MaterialIcons
                          name={index % 2 === 0 ? "directions-run" : "accessibility-new"}
                          size={isCompact ? 18 : 22}
                          color="rgba(212, 175, 55, 0.7)"
                        />
                      </View>
                      <View style={s.recentCopy}>
                        <AppText
                          variant="body"
                          style={[s.recentTitle, isCompact && s.recentTitleCompact]}
                        >
                          {title}
                        </AppText>
                        <AppText
                          variant="caption"
                          style={[s.recentMeta, isCompact && s.recentMetaCompact]}
                        >
                          {date} • {duration}
                        </AppText>
                      </View>
                    </View>

                    <View style={[s.recentRight, isCompact && s.recentRightCompact]}>
                      <AppText
                        variant="statValue"
                        style={[s.recentVolume, isCompact && s.recentVolumeCompact]}
                      >
                        {volume}
                      </AppText>
                      <AppText
                        variant="caption"
                        style={[
                          s.recentTrend,
                          isCompact && s.recentTrendCompact,
                          { color: trendColor },
                        ]}
                      >
                        {trendText || fallback.trend}
                      </AppText>
                    </View>
                  </PressScaleCard>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFill,
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
  contentFrame: {
    flex: 1,
  },
  scrollViewport: {},
  scrollContent: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  scrollContentCompact: {
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  headerCompact: {
    minHeight: 52,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  burger: {
    gap: 5,
  },
  burgerLine: {
    height: 2,
    backgroundColor: GOLD,
    borderRadius: 1,
  },
  burgerLineWide: {
    width: 28,
  },
  burgerLineShort: {
    width: 20,
  },
  burgerLineMid: {
    width: 24,
  },
  headerTitle: {
    color: TEXT_MAIN,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 3.2,
    textTransform: "uppercase",
  },
  headerTitleCompact: {
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 2.4,
  },
  avatarWrap: {
    width: 44,
    height: 44,
  },
  avatarPressed: {
    transform: [{ scale: 0.95 }],
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.4)",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  avatarBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: BG_DARK,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarBadgeText: {
    color: "#1A1A1A",
    fontSize: 10,
    lineHeight: 12,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_BG,
    overflow: "hidden",
  },
  heroCard: {
    padding: 20,
    gap: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 5,
  },
  heroCardCompact: {
    padding: 16,
    gap: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  heroLeftCol: {
    flex: 1,
    marginRight: 8,
  },
  heroCaption: {
    color: "rgba(212, 175, 55, 0.7)",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  heroTitle: {
    color: TEXT_MAIN,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 1,
    textTransform: "uppercase",
    flexShrink: 1,
  },
  heroTitleCompact: {
    fontSize: 20,
    lineHeight: 24,
  },
  statusPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_GREEN,
    shadowColor: ACCENT_GREEN,
    shadowOpacity: 0.55,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    flexShrink: 0,
  },
  exerciseBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseBadgeText: {
    color: TEXT_MUTED,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  timerCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  timerCardCompact: {
    paddingVertical: 10,
  },
  timerText: {
    color: TEXT_MAIN,
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: -1.5,
  },
  timerTextCompact: {
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: -1,
  },
  timerAccent: {
    color: GOLD,
    textShadowColor: "rgba(212, 175, 55, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timerLabel: {
    marginTop: 4,
    color: TEXT_MUTED,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 4,
    textTransform: "uppercase",
    opacity: 0.4,
  },
  progressBlock: {
    gap: 8,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  progressLabel: {
    color: "rgba(160, 160, 160, 0.5)",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  progressValue: {
    color: GOLD,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1.8,
  },
  progressTrack: {
    height: 3,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  continueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    opacity: 0.3,
  },
  continueText: {
    color: TEXT_MAIN,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: 0.9,
  },
  section: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  sectionTitle: {
    color: GOLD,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  sectionTitleCompact: {
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 2,
  },
  sectionMeta: {
    color: TEXT_MUTED,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  sectionMetaCompact: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1.6,
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    width: "100%",
  },
  calendarItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  calendarLabel: {
    color: TEXT_MUTED,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.5,
    opacity: 0.6,
  },
  calendarLabelToday: {
    color: GOLD,
    opacity: 1,
  },
  calendarTodayRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: GOLD,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarTodayText: {
    color: GOLD,
    fontSize: 12,
    lineHeight: 14,
  },
  calendarWorkoutContainer: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarWorkoutGlow: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: "rgba(212, 175, 55, 0.5)",
  },
  calendarWorkoutFlashRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: GOLD,
    backgroundColor: GLASS_BG,
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarEmptyRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: GLASS_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarEmptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  yesterdayTitle: {
    color: TEXT_MAIN,
    marginLeft: 2,
    marginBottom: 20,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  yesterdayTitleCompact: {
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 1,
  },
  yesterdayCard: {
    padding: 20,
    gap: 18,
  },
  yesterdayTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  yesterdayLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  yesterdayIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  yesterdayCopy: {
    flex: 1,
  },
  yesterdayWorkoutTitle: {
    color: TEXT_MAIN,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  yesterdayWorkoutTitleCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
  completedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  completedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_GREEN,
    shadowColor: ACCENT_GREEN,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
  completedText: {
    color: ACCENT_GREEN,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  yesterdayChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  yesterdayStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  yesterdayStat: {
    flex: 1,
    alignItems: "center",
  },
  yesterdayStatValue: {
    color: TEXT_MAIN,
    fontSize: 20,
    lineHeight: 24,
  },
  yesterdayStatValueCompact: {
    fontSize: 17,
    lineHeight: 20,
  },
  yesterdayStatLabel: {
    marginTop: 4,
    color: TEXT_MUTED,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  recentList: {
    gap: 20,
  },
  recentCard: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentCardCompact: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  recentLeftCompact: {
    gap: 10,
  },
  recentIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  recentIconWrapCompact: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  recentCopy: {
    flex: 1,
  },
  recentTitle: {
    color: TEXT_MAIN,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  recentTitleCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
  recentMeta: {
    marginTop: 2,
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  recentMetaCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  recentRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  recentRightCompact: {
    alignItems: "flex-end",
    marginLeft: 8,
    marginTop: 0,
  },
  recentVolume: {
    color: TEXT_MAIN,
    fontSize: 17,
    lineHeight: 24,
  },
  recentVolumeCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
  recentTrend: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  recentTrendCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  bottomShell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    zIndex: 50,
  },
  bottomShellCompact: {
    paddingHorizontal: 16,
  },
  bottomShellInner: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: -32,
    zIndex: 60,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: GOLD,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
  },
  fabInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dock: {
    width: "100%",
    minHeight: 80,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  dockCompact: {
    minHeight: 72,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 28,
  },
  dockItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 44,
  },
  dockPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  dockSpacer: {
    flex: 1,
    minWidth: 64,
  },
  dockLabel: {
    color: "rgba(229, 226, 225, 0.5)",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  dockLabelCompact: {
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 1.6,
  },
  dockLabelActive: {
    color: GOLD,
  },
});

import { ScrollView, StyleSheet, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { PrimaryButton } from "@/components/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { SectionHeader } from "@/components/section-header";
import { StatsRow } from "@/features/home/components/stats-row";
import { WeeklyProgressCard } from "@/features/home/components/weekly-progress-card";
import { WorkoutHeroCard } from "@/features/home/components/workout-hero-card";
import { useHomeStore } from "@/store/use-home-store";
import { theme } from "@/theme";

export function HomeScreen() {
  const greeting = useHomeStore((state) => state.greeting);
  const userName = useHomeStore((state) => state.userName);
  const summary = useHomeStore((state) => state.summary);
  const stats = useHomeStore((state) => state.stats);
  const weeklyProgress = useHomeStore((state) => state.weeklyProgress);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glow} />

        <AppHeader greeting={greeting} userName={userName} />
        <WorkoutHeroCard summary={summary} />

        <View style={styles.section}>
          <SectionHeader title="Stats" subtitle="This week overview" />
          <StatsRow stats={stats} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Progress" subtitle="Weekly consistency" />
          <WeeklyProgressCard progress={weeklyProgress} />
        </View>

        <PrimaryButton>Start Workout</PrimaryButton>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.md,
  },
  glow: {
    position: "absolute",
    width: 190,
    height: 190,
    top: -70,
    right: -80,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryMuted,
    opacity: 0.85,
  },
});

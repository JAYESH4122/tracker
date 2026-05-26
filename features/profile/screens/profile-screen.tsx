import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppText, Card, SectionHeader } from "@/components";
import { useHomeStore } from "@/store/use-home-store";
import { useStatsStore } from "@/store/use-stats-store";
import { theme } from "@/theme";

export function ProfileScreen() {
  const userName = useHomeStore((state) => state.userName);
  const summary = useStatsStore.getState().getSummary();

  const initials = userName
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Profile" subtitle="Local app settings and identity" />

      <Card elevated style={styles.profileCard}>
        <View style={styles.avatar}>
          <AppText variant="title" color="background">
            {initials}
          </AppText>
        </View>
        <View style={styles.copy}>
          <AppText variant="sectionTitle">{userName}</AppText>
          <AppText variant="caption" color="subtext">
            Offline MVP profile
          </AppText>
        </View>
      </Card>

      <Card>
        <SectionHeader title="App Snapshot" subtitle="Read-only for this MVP" />
        <View style={styles.row}>
          <Ionicons name="barbell" size={16} color={theme.colors.primary} />
          <AppText variant="body" color="subtext">
            {summary.totalWorkouts} workouts tracked locally
          </AppText>
        </View>
        <View style={styles.row}>
          <Ionicons name="analytics" size={16} color={theme.colors.primary} />
          <AppText variant="body" color="subtext">
            {summary.totalVolume.toLocaleString()} kg total volume
          </AppText>
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
});

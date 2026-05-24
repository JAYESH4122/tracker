import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppText, Card, ScreenContainer, SectionHeader } from "@/components";
import { theme } from "@/theme";

const settingsGroups = [
  {
    title: "Account",
    items: ["Personal details", "Subscription", "Connected devices"],
  },
  {
    title: "Preferences",
    items: ["Units", "Workout reminders", "Rest timer defaults"],
  },
  {
    title: "App settings",
    items: ["Notifications", "Privacy", "Support"],
  },
] as const;

export function ProfileScreen() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Profile" subtitle="Your training identity" />

        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <AppText variant="title">JP</AppText>
          </View>
          <View style={styles.userCopy}>
            <AppText variant="title">Jayesh Patel</AppText>
            <AppText variant="body" color="subtext">
              Performance-focused athlete
            </AppText>
          </View>
        </Card>

        <View style={styles.summaryRow}>
          <Card elevated style={styles.summaryItem}>
            <AppText variant="statValue">128</AppText>
            <AppText variant="caption" color="subtext">
              Workouts
            </AppText>
          </Card>
          <Card elevated style={styles.summaryItem}>
            <AppText variant="statValue">14</AppText>
            <AppText variant="caption" color="subtext">
              Day Streak
            </AppText>
          </Card>
        </View>

        {settingsGroups.map((group) => (
          <Card key={group.title} style={styles.groupCard}>
            <SectionHeader title={group.title} />
            {group.items.map((item, index) => (
              <View
                key={item}
                style={[styles.settingRow, index === 0 ? styles.settingRowFirst : null]}
              >
                <AppText variant="body">{item}</AppText>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.subtext} />
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  userCopy: {
    gap: 4,
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  summaryItem: {
    flex: 1,
    gap: 2,
  },
  groupCard: {
    gap: theme.spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  settingRowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
});

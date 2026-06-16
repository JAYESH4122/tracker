import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  PremiumCard,
  PremiumDivider,
  PremiumHeader,
  PremiumMetricTile,
  PremiumScrollScreen,
} from "@/components";
import { useHomeStore } from "@/store/use-home-store";
import { useStatsStore } from "@/store/use-stats-store";

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
    <PremiumScrollScreen>
      <PremiumHeader title="Profile" leftIcon="menu" onLeftPress={() => {}} />

      <PremiumCard accent style={styles.profileCard}>
        <View style={styles.avatar}>
          <AppText variant="title" color="background" style={styles.avatarText}>
            {initials}
          </AppText>
        </View>
        <View style={styles.copy}>
          <AppText variant="caption" color="primary" style={styles.eyebrow}>
            Local Athlete
          </AppText>
          <AppText variant="display" style={styles.name}>
            {userName}
          </AppText>
          <AppText variant="body" color="subtext" style={styles.profileSub}>
            Offline training profile and app snapshot.
          </AppText>
        </View>
      </PremiumCard>

      <View style={styles.metricsGrid}>
        <PremiumMetricTile
          icon="fitness-center"
          label="Workouts"
          value={String(summary.totalWorkouts).padStart(2, "0")}
          style={styles.metricTile}
        />
        <PremiumMetricTile
          icon="analytics"
          label="Volume"
          value={`${summary.totalVolume.toLocaleString()}kg`}
          accent
          style={styles.metricTile}
        />
      </View>

      <PremiumDivider />

      <PremiumCard style={styles.snapshotCard}>
        <View style={styles.sectionHeader}>
          <AppText variant="caption" color="primary" style={styles.eyebrow}>
            App Snapshot
          </AppText>
          <AppText variant="title">Read-Only MVP</AppText>
        </View>

        <View style={styles.rows}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <MaterialIcons name="storage" size={18} color="#D4AF37" />
            </View>
            <View style={styles.rowCopy}>
              <AppText variant="body">{summary.totalWorkouts} workouts tracked locally</AppText>
              <AppText variant="caption" color="subtext" style={styles.rowMeta}>
                Stored on this device for the MVP.
              </AppText>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <MaterialIcons name="verified" size={18} color="#D4AF37" />
            </View>
            <View style={styles.rowCopy}>
              <AppText variant="body">Premium dark UI active</AppText>
              <AppText variant="caption" color="subtext" style={styles.rowMeta}>
                Home styling is now carried through the app shell.
              </AppText>
            </View>
          </View>
        </View>
      </PremiumCard>
    </PremiumScrollScreen>
  );
}

const styles = StyleSheet.create({
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.26)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBadgeText: {
    fontFamily: "Anta_400Regular",
    fontSize: 13,
    lineHeight: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  },
  avatarText: {
    fontFamily: "Anta_400Regular",
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  eyebrow: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  name: {
    color: "#D4AF37",
    fontSize: 31,
    lineHeight: 35,
  },
  profileSub: {
    fontSize: 14,
    lineHeight: 21,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricTile: {
    minHeight: 104,
  },
  snapshotCard: {
    gap: 16,
  },
  sectionHeader: {
    gap: 4,
  },
  rows: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    padding: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.22)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowMeta: {
    fontSize: 12,
    lineHeight: 17,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { theme } from "@/theme";

type StatCardProps = {
  label: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tone?: "primary" | "neutral" | "danger";
};

export function StatCard({ label, value, iconName, tone = "primary" }: StatCardProps) {
  return (
    <Card elevated style={styles.card}>
      <View style={styles.overlay}>
        <View style={[styles.iconWrap, tone === "danger" ? styles.iconDanger : null]}>
          <Ionicons
            name={iconName}
            size={16}
            color={tone === "danger" ? theme.colors.danger : theme.colors.primary}
          />
        </View>
        <AppText variant="statValue">{value}</AppText>
        <AppText variant="caption" color="subtext">
          {label}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 0,
    overflow: "hidden",
  },
  overlay: {
    minHeight: 116,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  iconDanger: {
    backgroundColor: "rgba(255, 90, 106, 0.12)",
  },
});

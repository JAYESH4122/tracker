import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  actionAccessory?: ReactNode;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  actionAccessory,
}: SectionHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <View style={styles.kicker} />
          <AppText variant="sectionTitle">{title}</AppText>
        </View>
        {subtitle ? (
          <AppText variant="caption" color="subtext">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} style={styles.action}>
          <AppText variant="caption" color="primary">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
      {actionAccessory}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  kicker: {
    width: 3,
    height: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  copy: {
    gap: 4,
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  action: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryMuted,
  },
});

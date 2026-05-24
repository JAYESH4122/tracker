import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.kicker} />
      <View style={styles.copy}>
        <AppText variant="sectionTitle">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color="subtext">
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  kicker: {
    width: 4,
    height: 28,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  copy: {
    gap: 4,
  },
});

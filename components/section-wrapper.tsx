import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type SectionWrapperProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function SectionWrapper({ title, subtitle, children }: SectionWrapperProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  header: {
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

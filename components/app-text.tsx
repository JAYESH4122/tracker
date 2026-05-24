import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

import { theme } from "@/theme";

type AppTextProps = PropsWithChildren<{
  variant?: keyof typeof theme.typography;
  color?: keyof typeof theme.colors;
  style?: StyleProp<TextStyle>;
}>;

export function AppText({ children, variant = "body", color = "text", style }: AppTextProps) {
  return (
    <Text style={[styles.base, theme.typography[variant], styles[color], style]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
  background: { color: theme.colors.background },
  card: { color: theme.colors.card },
  cardElevated: { color: theme.colors.cardElevated },
  primary: { color: theme.colors.primary },
  primaryMuted: { color: theme.colors.primaryMuted },
  text: { color: theme.colors.text },
  subtext: { color: theme.colors.subtext },
  border: { color: theme.colors.border },
  overlay: { color: theme.colors.overlay },
  danger: { color: theme.colors.danger },
});

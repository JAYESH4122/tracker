import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "@/theme";

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}>;

export function Card({ children, style, elevated = false }: CardProps) {
  return <View style={[styles.card, elevated ? styles.elevated : null, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    shadowColor: "#000000",
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  elevated: {
    backgroundColor: theme.colors.cardElevated,
    shadowOpacity: 0.4,
    elevation: 8,
  },
});

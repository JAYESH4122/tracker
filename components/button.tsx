import type { ReactNode, PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type ButtonProps = PropsWithChildren<{
  onPress?: (() => void) | undefined;
  variant?: "solid" | "ghost" | "danger";
  leftAccessory?: ReactNode;
  disabled?: boolean;
}>;

export function Button({
  children,
  onPress,
  variant = "solid",
  leftAccessory,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View style={styles.content}>
        {leftAccessory}
        <AppText variant="button" color={variant === "solid" ? "background" : "text"}>
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  solid: {
    backgroundColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: "rgba(255, 90, 106, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 90, 106, 0.24)",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.45,
  },
});

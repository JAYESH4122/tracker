import { PropsWithChildren } from "react";
import { Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type PrimaryButtonProps = PropsWithChildren<{
  onPress?: () => void;
}>;

export function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <AppText variant="button" color="background">
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});

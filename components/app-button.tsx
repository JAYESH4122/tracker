import { PropsWithChildren } from "react";
import { ImageBackground, Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type AppButtonProps = PropsWithChildren<{
  onPress?: () => void;
}>;

export function AppButton({ children, onPress }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <ImageBackground
        source={require("../assets/images/ui/cta-premium.png")}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <AppText variant="button" color="background">
          {children}
        </AppText>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: theme.radius.xl,
    shadowColor: "#00FF88",
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  bg: {
    minHeight: 58,
    borderRadius: theme.radius.xl,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  bgImage: {
    borderRadius: theme.radius.xl,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});

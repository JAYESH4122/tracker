import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { theme } from "@/theme";

type StatCardProps = {
  label: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

export function StatCard({ label, value, iconName }: StatCardProps) {
  return (
    <Card elevated style={styles.card}>
      <ImageBackground
        source={require("@/assets/images/ui/stats-premium.png")}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.overlay}>
          <View style={styles.iconWrap}>
            <Ionicons name={iconName} size={16} color={theme.colors.primary} />
          </View>
          <AppText variant="statValue">{value}</AppText>
          <AppText variant="caption" color="subtext">
            {label}
          </AppText>
        </View>
      </ImageBackground>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 0,
    overflow: "hidden",
  },
  bg: {
    minHeight: 132,
  },
  bgImage: {
    borderRadius: theme.radius.lg,
  },
  overlay: {
    minHeight: 132,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(13, 14, 20, 0.62)",
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
});

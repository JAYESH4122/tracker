import { ImageBackground, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { theme } from "@/theme";
import { WeeklyProgressItem } from "@/types/home";

type WeeklyProgressCardProps = {
  progress: WeeklyProgressItem[];
};

export function WeeklyProgressCard({ progress }: WeeklyProgressCardProps) {
  return (
    <Card elevated style={styles.card}>
      <ImageBackground
        source={require("@/assets/images/ui/progress-premium.png")}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.overlay}>
          <View style={styles.barRow}>
            {progress.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.track}>
                  <View style={[styles.fill, { height: `${item.value}%` }]} />
                </View>
                <AppText variant="caption" color="subtext">
                  {item.day}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </ImageBackground>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
  },
  bg: {
    minHeight: 170,
  },
  bgImage: {
    borderRadius: theme.radius.lg,
  },
  overlay: {
    minHeight: 170,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(12, 13, 19, 0.56)",
    padding: theme.spacing.lg,
  },
  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: theme.spacing.xs,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  track: {
    height: 102,
    width: "100%",
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
});

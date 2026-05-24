import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { theme } from "@/theme";
import { WorkoutSummary } from "@/types/home";

type WorkoutHeroCardProps = {
  summary: WorkoutSummary;
};

export function WorkoutHeroCard({ summary }: WorkoutHeroCardProps) {
  return (
    <Card style={styles.card}>
      <ImageBackground
        source={require("@/assets/images/ui/hero-premium.png")}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.scrim}>
          <AppText variant="caption" color="subtext">
            {summary.title}
          </AppText>
          <AppText variant="title" style={styles.headline}>
            {summary.subtitle}
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color={theme.colors.primary} />
              <AppText variant="body">{summary.duration}</AppText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="flame" size={16} color={theme.colors.primary} />
              <AppText variant="body">{summary.calories}</AppText>
            </View>
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
    minHeight: 220,
  },
  bgImage: {
    borderRadius: theme.radius.lg,
  },
  scrim: {
    minHeight: 220,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(10, 11, 15, 0.48)",
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    justifyContent: "space-between",
  },
  headline: {
    maxWidth: "76%",
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: "rgba(11, 11, 16, 0.62)",
    borderRadius: theme.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.sm,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { theme } from "@/theme";
import type { Exercise } from "@/types/workout";
import { getYouTubeThumbnailUrl } from "@/utils/workout";

type ExerciseCardProps = {
  exercise: Exercise;
  onPress?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  subtitle?: string;
  highlight?: string;
  isCompact?: boolean;
};

export function ExerciseCard({
  exercise,
  onPress,
  actionLabel,
  onActionPress,
  subtitle,
  highlight,
  isCompact = false,
}: ExerciseCardProps) {
  const thumbnail = getYouTubeThumbnailUrl(exercise.youtubeUrl);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <Card style={[styles.card, isCompact ? styles.compact : null]}>
        <View style={styles.header}>
          <View style={styles.thumbnailWrap}>
            {thumbnail ? (
              <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailFallback}>
                <Ionicons name="barbell" size={20} color={theme.colors.primary} />
              </View>
            )}
            <View style={styles.playBadge}>
              <Ionicons name="play" size={12} color={theme.colors.background} />
            </View>
          </View>

          <View style={styles.headerText}>
            <AppText variant="sectionTitle">{exercise.name}</AppText>
            <AppText variant="caption" color="subtext">
              {subtitle ?? exercise.muscleGroup}
            </AppText>
            <View style={styles.metaRow}>
              <View style={styles.chip}>
                <AppText variant="caption" color="primary">
                  {exercise.muscleGroup}
                </AppText>
              </View>
              {exercise.isCustom ? (
                <View style={styles.chipSecondary}>
                  <AppText variant="caption" color="text">
                    Custom
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {highlight ? (
          <View style={styles.highlight}>
            <Ionicons name="sparkles" size={14} color={theme.colors.primary} />
            <AppText variant="caption" color="primary">
              {highlight}
            </AppText>
          </View>
        ) : null}

        {actionLabel && onActionPress ? (
          <Pressable
            onPress={onActionPress}
            style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          >
            <AppText variant="caption" color="background">
              {actionLabel}
            </AppText>
          </Pressable>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  compact: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  thumbnailWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryMuted,
  },
  chipSecondary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 8,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(0, 255, 136, 0.08)",
  },
  action: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  actionPressed: {
    opacity: 0.92,
  },
  pressed: {
    opacity: 0.98,
  },
});

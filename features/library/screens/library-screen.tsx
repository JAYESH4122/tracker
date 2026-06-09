import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, useWindowDimensions, View } from "react-native";

import {
  AppText,
  PremiumCard,
  PremiumDivider,
  PremiumHeader,
  PremiumPrimaryAction,
  PremiumScrollScreen,
} from "@/components";

const ROUTINE_EXERCISES = [
  { name: "Barbell Back Squat", tag: "Quads", sets: "4 x 8" },
  { name: "Walking Lunges", tag: "Legs", sets: "3 x 12" },
  { name: "Leg Extensions", tag: "Isolation", sets: "3 x 15" },
];

export function LibraryScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 820;

  return (
    <PremiumScrollScreen contentContainerStyle={isWide ? styles.wideContent : null}>
      <PremiumHeader
        title="Library"
        right={
          <View style={styles.draftPill}>
            <AppText variant="caption" color="primary" style={styles.draftText}>
              #04
            </AppText>
          </View>
        }
      />

      <PremiumCard accent style={styles.heroCard}>
        <AppText variant="caption" color="primary" style={styles.eyebrow}>
          Routine Creator
        </AppText>
        <AppText variant="display" style={styles.heroTitle}>
          Build The Next Session
        </AppText>
        <AppText variant="body" color="subtext" style={styles.heroSub}>
          Assemble movements, keep PR tracking on, and save a routine that feels ready before the
          first set starts.
        </AppText>
      </PremiumCard>

      <View style={[styles.builderLayout, isWide ? styles.builderLayoutWide : null]}>
        <View style={styles.mainColumn}>
          <PremiumCard style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <AppText variant="caption" color="subtext" style={styles.fieldLabel}>
                Routine Identity
              </AppText>
              <TextInput
                placeholder="e.g. Hypertrophy - Push Day A"
                placeholderTextColor="rgba(160, 160, 160, 0.75)"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <AppText variant="caption" color="subtext" style={styles.fieldLabel}>
                Exercise Library
              </AppText>
              <View style={styles.inputWithIcon}>
                <TextInput
                  placeholder="Select exercise"
                  placeholderTextColor="rgba(160, 160, 160, 0.75)"
                  style={[styles.input, styles.inputEmbedded]}
                />
                <MaterialIcons name="expand-more" size={24} color="#D4AF37" />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <AppText variant="caption" color="subtext" style={styles.fieldLabel}>
                Custom Variation
              </AppText>
              <View style={styles.customRow}>
                <TextInput
                  placeholder="Type custom exercise"
                  placeholderTextColor="rgba(160, 160, 160, 0.75)"
                  style={[styles.input, styles.customInput]}
                />
                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => [
                    styles.appendButton,
                    pressed ? styles.appendPressed : null,
                  ]}
                >
                  <MaterialIcons name="add" size={18} color="#D4AF37" />
                  <AppText variant="caption" color="primary" style={styles.appendText}>
                    Append
                  </AppText>
                </Pressable>
              </View>
            </View>
          </PremiumCard>

          <PremiumDivider />

          <PremiumCard style={styles.orderCard}>
            <View style={styles.cardHeader}>
              <View>
                <AppText variant="caption" color="primary" style={styles.eyebrow}>
                  Exercise Order
                </AppText>
                <AppText variant="title">3 Movements</AppText>
              </View>
              <MaterialIcons name="drag-indicator" size={24} color="#D4AF37" />
            </View>

            <View style={styles.exerciseList}>
              {ROUTINE_EXERCISES.map((exercise, index) => (
                <View key={exercise.name} style={styles.exerciseRow}>
                  <View style={styles.exerciseIndex}>
                    <AppText variant="caption" color="primary" style={styles.exerciseIndexText}>
                      {index + 1}
                    </AppText>
                  </View>
                  <View style={styles.exerciseCopy}>
                    <AppText variant="sectionTitle" style={styles.exerciseName}>
                      {exercise.name}
                    </AppText>
                    <View style={styles.tagRow}>
                      <View style={styles.tag}>
                        <AppText variant="caption" color="subtext" style={styles.tagText}>
                          {exercise.tag}
                        </AppText>
                      </View>
                      <View style={styles.tag}>
                        <AppText variant="caption" color="subtext" style={styles.tagText}>
                          {exercise.sets}
                        </AppText>
                      </View>
                    </View>
                  </View>
                  <MaterialIcons name="close" size={22} color="rgba(229, 226, 225, 0.55)" />
                </View>
              ))}
            </View>
          </PremiumCard>
        </View>

        <View style={styles.sideColumn}>
          <PremiumCard style={styles.settingsCard}>
            <AppText variant="caption" color="primary" style={styles.eyebrow}>
              Routine Settings
            </AppText>
            <View style={styles.settingRows}>
              <View style={styles.settingRow}>
                <View>
                  <AppText variant="body">Public Routine</AppText>
                  <AppText variant="caption" color="subtext" style={styles.settingHint}>
                    Keep private while drafting
                  </AppText>
                </View>
                <View style={styles.toggle}>
                  <View style={styles.toggleDot} />
                </View>
              </View>
              <View style={styles.settingRow}>
                <View>
                  <AppText variant="body">Track PRs</AppText>
                  <AppText variant="caption" color="subtext" style={styles.settingHint}>
                    Watch best sets automatically
                  </AppText>
                </View>
                <View style={[styles.toggle, styles.toggleActive]}>
                  <View style={[styles.toggleDot, styles.toggleDotActive]} />
                </View>
              </View>
            </View>
          </PremiumCard>

          <PremiumCard accent style={styles.previewCard}>
            <MaterialIcons name="bolt" size={28} color="#D4AF37" />
            <AppText variant="title" style={styles.previewTitle}>
              Push Your Limits
            </AppText>
            <AppText variant="body" color="subtext" style={styles.previewText}>
              Draft routines should feel as polished as a finished workout summary.
            </AppText>
          </PremiumCard>

          <PremiumPrimaryAction icon="save" onPress={() => {}}>
            Save Routine
          </PremiumPrimaryAction>
        </View>
      </View>
    </PremiumScrollScreen>
  );
}

const styles = StyleSheet.create({
  wideContent: {
    maxWidth: 980,
  },
  draftPill: {
    minWidth: 42,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.26)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  draftText: {
    fontFamily: "Anta_400Regular",
    fontSize: 11,
    letterSpacing: 1,
  },
  heroCard: {
    gap: 4,
  },
  eyebrow: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#D4AF37",
    fontSize: 32,
    lineHeight: 36,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 21,
  },
  builderLayout: {
    gap: 20,
  },
  builderLayoutWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mainColumn: {
    flex: 1,
    gap: 20,
    minWidth: 0,
  },
  sideColumn: {
    gap: 16,
  },
  formCard: {
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(0, 0, 0, 0.24)",
    color: "#E5E2E1",
    fontFamily: "Anta_400Regular",
    fontSize: 15,
    paddingHorizontal: 14,
  },
  inputWithIcon: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(0, 0, 0, 0.24)",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  inputEmbedded: {
    flex: 1,
    minHeight: 50,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  customRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "stretch",
  },
  customInput: {
    flex: 1,
    minWidth: 0,
  },
  appendButton: {
    minWidth: 102,
    paddingHorizontal: 12,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.16)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
  },
  appendPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
  appendText: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  orderCard: {
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  exerciseList: {
    gap: 10,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    padding: 12,
  },
  exerciseIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.24)",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseIndexText: {
    fontFamily: "Anta_400Regular",
    fontSize: 12,
  },
  exerciseCopy: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  exerciseName: {
    textTransform: "uppercase",
  },
  tagRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: "Anta_400Regular",
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  settingsCard: {
    gap: 16,
  },
  settingRows: {
    gap: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  settingHint: {
    fontSize: 11,
    lineHeight: 16,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 3,
  },
  toggleActive: {
    borderColor: "rgba(212, 175, 55, 0.42)",
    backgroundColor: "rgba(212, 175, 55, 0.2)",
  },
  toggleDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(229, 226, 225, 0.45)",
  },
  toggleDotActive: {
    backgroundColor: "#D4AF37",
    transform: [{ translateX: 18 }],
  },
  previewCard: {
    gap: 8,
  },
  previewTitle: {
    color: "#D4AF37",
    textTransform: "uppercase",
  },
  previewText: {
    fontSize: 13,
    lineHeight: 20,
  },
});

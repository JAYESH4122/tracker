import { Ionicons } from "@expo/vector-icons";
import type { Ref } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";
import { formatWorkoutValue } from "@/utils/workout";

type SetInputRowProps = {
  setNumber: number;
  previousValue?: string | undefined;
  reps: number | null;
  weight: number | null;
  isCompleted: boolean;
  onChangeReps: (value: string) => void;
  onChangeWeight: (value: string) => void;
  onToggleComplete: () => void;
  onRemove?: (() => void) | undefined;
  weightInputRef?: Ref<TextInput>;
  repsInputRef?: Ref<TextInput>;
  onWeightSubmitEditing?: () => void;
  onRepsSubmitEditing?: () => void;
};

export function SetInputRow({
  setNumber,
  previousValue,
  reps,
  weight,
  isCompleted,
  onChangeReps,
  onChangeWeight,
  onToggleComplete,
  onRemove,
  weightInputRef,
  repsInputRef,
  onWeightSubmitEditing,
  onRepsSubmitEditing,
}: SetInputRowProps) {
  return (
    <View style={[styles.row, isCompleted ? styles.completed : null]}>
      <View style={styles.cellSet}>
        <AppText variant="caption" color="subtext">
          {setNumber}
        </AppText>
      </View>

      <View style={styles.cellPrev}>
        <AppText variant="caption" color="subtext">
          {previousValue ?? "—"}
        </AppText>
      </View>

      <TextInput
        ref={weightInputRef}
        value={formatWorkoutValue(weight)}
        placeholder="0"
        placeholderTextColor={theme.colors.subtext}
        keyboardType="numeric"
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={onWeightSubmitEditing}
        onChangeText={onChangeWeight}
        selectTextOnFocus
        style={[styles.input, styles.weightInput]}
      />
      <TextInput
        ref={repsInputRef}
        value={formatWorkoutValue(reps)}
        placeholder="0"
        placeholderTextColor={theme.colors.subtext}
        keyboardType="numeric"
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={onRepsSubmitEditing}
        onChangeText={onChangeReps}
        selectTextOnFocus
        style={[styles.input, styles.repsInput]}
      />

      <Pressable onPress={onToggleComplete} style={styles.checkbox}>
        <Ionicons
          name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={isCompleted ? theme.colors.primary : theme.colors.subtext}
        />
      </Pressable>

      {onRemove ? (
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
        </Pressable>
      ) : (
        <View style={styles.removeSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  completed: {
    backgroundColor: "rgba(0, 255, 136, 0.04)",
  },
  input: {
    height: 38,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 10,
    color: theme.colors.text,
    fontFamily: theme.fonts.semibold,
    textAlign: "center",
  },
  weightInput: {
    width: 78,
  },
  repsInput: {
    width: 68,
  },
  cellSet: {
    width: 30,
    alignItems: "center",
  },
  cellPrev: {
    flex: 1,
    minWidth: 68,
  },
  checkbox: {
    width: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "rgba(255, 90, 106, 0.12)",
  },
  removeSpacer: {
    width: 34,
    height: 34,
  },
});

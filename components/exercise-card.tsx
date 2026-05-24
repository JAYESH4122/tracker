import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { InputField } from "@/components/input-field";
import { PrimaryButton } from "@/components/primary-button";
import { theme } from "@/theme";

export type ExerciseSet = {
  id: string;
  reps: string;
  weight: string;
};

export type ExerciseItem = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: ExerciseSet[];
};

type ExerciseCardProps = {
  exercise: ExerciseItem;
  onAddSet: (exerciseId: string) => void;
  onChangeSet: (exerciseId: string, setId: string, field: "reps" | "weight", value: string) => void;
};

export function ExerciseCard({ exercise, onAddSet, onChangeSet }: ExerciseCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText variant="sectionTitle">{exercise.name}</AppText>
          <AppText variant="caption" color="subtext">
            {exercise.muscleGroup}
          </AppText>
        </View>
        <Ionicons name="fitness" size={18} color={theme.colors.primary} />
      </View>

      {exercise.sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <AppText variant="caption" color="subtext" style={styles.setLabel}>
            Set {index + 1}
          </AppText>
          <View style={styles.inputs}>
            <View style={styles.inputWrap}>
              <InputField
                label="Reps"
                value={set.reps}
                placeholder="0"
                keyboardType="numeric"
                onChangeText={(value) => onChangeSet(exercise.id, set.id, "reps", value)}
              />
            </View>
            <View style={styles.inputWrap}>
              <InputField
                label="Weight"
                value={set.weight}
                placeholder="kg"
                keyboardType="numeric"
                onChangeText={(value) => onChangeSet(exercise.id, set.id, "weight", value)}
              />
            </View>
          </View>
        </View>
      ))}

      <PrimaryButton onPress={() => onAddSet(exercise.id)}>Add Set</PrimaryButton>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  setRow: {
    gap: theme.spacing.xs,
  },
  setLabel: {
    marginBottom: 2,
  },
  inputs: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  inputWrap: {
    flex: 1,
  },
});

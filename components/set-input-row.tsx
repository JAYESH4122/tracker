import { MaterialIcons } from "@expo/vector-icons";
import type { Ref } from "react";
import { Pressable, TextInput, View, Text } from "react-native";

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
  const handleIncWeight = () => {
    onChangeWeight(String((weight || 0) + 2.5));
  };
  const handleDecWeight = () => {
    onChangeWeight(String(Math.max(0, (weight || 0) - 2.5)));
  };
  const handleIncReps = () => {
    onChangeReps(String((reps || 0) + 1));
  };
  const handleDecReps = () => {
    onChangeReps(String(Math.max(0, (reps || 0) - 1)));
  };

  return (
    <View
      className={`flex-row items-center gap-2 py-2 px-2 rounded-lg ${isCompleted ? "bg-success-emerald/5" : ""}`}
    >
      {/* Set Number */}
      <View className="w-6 items-center justify-center">
        <Text className="font-numeric-data text-on-surface-variant text-sm">{setNumber}</Text>
      </View>

      {/* Previous */}
      <View className="flex-1 min-w-[50px]">
        <Text className="font-numeric-data text-xs text-on-surface-variant" numberOfLines={1}>
          {previousValue ?? "—"}
        </Text>
      </View>

      {/* Weight Input Group */}
      <View className="flex-row items-center gap-1">
        <Pressable
          onPress={handleDecWeight}
          className="w-7 h-7 rounded-full bg-surface-elevated items-center justify-center border border-border-subtle active:scale-95"
        >
          <MaterialIcons name="remove" size={16} color="#e5e2e1" />
        </Pressable>
        <TextInput
          ref={weightInputRef}
          value={formatWorkoutValue(weight)}
          placeholder="0"
          placeholderTextColor="#636565"
          keyboardType="numeric"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={onWeightSubmitEditing}
          onChangeText={onChangeWeight}
          selectTextOnFocus
          className="w-12 h-8 bg-surface-elevated border border-border-subtle rounded-md text-center font-numeric-data text-on-surface text-sm focus:border-primary-fixed"
        />
        <Pressable
          onPress={handleIncWeight}
          className="w-7 h-7 rounded-full bg-surface-elevated items-center justify-center border border-border-subtle active:scale-95"
        >
          <MaterialIcons name="add" size={16} color="#e5e2e1" />
        </Pressable>
      </View>

      {/* Reps Input Group */}
      <View className="flex-row items-center gap-1 ml-1">
        <Pressable
          onPress={handleDecReps}
          className="w-7 h-7 rounded-full bg-surface-elevated items-center justify-center border border-border-subtle active:scale-95"
        >
          <MaterialIcons name="remove" size={16} color="#e5e2e1" />
        </Pressable>
        <TextInput
          ref={repsInputRef}
          value={formatWorkoutValue(reps)}
          placeholder="0"
          placeholderTextColor="#636565"
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={onRepsSubmitEditing}
          onChangeText={onChangeReps}
          selectTextOnFocus
          className="w-10 h-8 bg-surface-elevated border border-border-subtle rounded-md text-center font-numeric-data text-on-surface text-sm focus:border-primary-fixed"
        />
        <Pressable
          onPress={handleIncReps}
          className="w-7 h-7 rounded-full bg-surface-elevated items-center justify-center border border-border-subtle active:scale-95"
        >
          <MaterialIcons name="add" size={16} color="#e5e2e1" />
        </Pressable>
      </View>

      {/* Check */}
      <Pressable
        onPress={onToggleComplete}
        onLongPress={onRemove}
        className={`w-9 h-9 ml-1 rounded-xl items-center justify-center border ${isCompleted ? "bg-success-emerald/20 border-success-emerald/30" : "bg-surface-elevated border-border-subtle"}`}
      >
        <MaterialIcons name="check" size={20} color={isCompleted ? "#00E676" : "#636565"} />
      </Pressable>
    </View>
  );
}

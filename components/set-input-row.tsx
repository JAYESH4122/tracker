import { MaterialIcons } from "@expo/vector-icons";
import type { Ref } from "react";
import { Pressable, TextInput, View, Text } from "react-native";

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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: isCompleted ? "rgba(74, 225, 118, 0.08)" : "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: isCompleted ? "rgba(74, 225, 118, 0.2)" : "rgba(255, 255, 255, 0.08)",
        marginBottom: 4,
      }}
    >
      {/* Set Number */}
      <View style={{ width: 32, alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "ArchivoNarrow_700Bold",
            fontSize: 13,
            color: isCompleted ? "#4AE176" : "#E5E2E1",
          }}
        >
          {setNumber}
        </Text>
      </View>

      {/* Previous */}
      <View style={{ flex: 1, paddingLeft: 8 }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: isCompleted ? "rgba(74, 225, 118, 0.7)" : "rgba(255, 255, 255, 0.5)",
          }}
          numberOfLines={1}
        >
          {previousValue ?? "—"}
        </Text>
      </View>

      {/* KG Input */}
      <View style={{ width: 64, alignItems: "center", marginRight: 8 }}>
        <TextInput
          ref={weightInputRef}
          value={weight !== null ? String(weight) : ""}
          placeholder="-"
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          keyboardType="numeric"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={onWeightSubmitEditing}
          onChangeText={onChangeWeight}
          selectTextOnFocus
          style={{
            width: "100%",
            height: 32,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 6,
            textAlign: "center",
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#E5E2E1",
            padding: 0,
          }}
        />
      </View>

      {/* Reps Input */}
      <View style={{ width: 64, alignItems: "center", marginRight: 8 }}>
        <TextInput
          ref={repsInputRef}
          value={reps !== null ? String(reps) : ""}
          placeholder="-"
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={onRepsSubmitEditing}
          onChangeText={onChangeReps}
          selectTextOnFocus
          style={{
            width: "100%",
            height: 32,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 6,
            textAlign: "center",
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#E5E2E1",
            padding: 0,
          }}
        />
      </View>

      {/* Check Checkbox */}
      <Pressable
        onPress={onToggleComplete}
        onLongPress={onRemove}
        style={{
          width: 32,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isCompleted ? (
          <MaterialIcons name="check-circle" size={22} color="#4AE176" />
        ) : (
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="check" size={14} color="rgba(255, 255, 255, 0.3)" />
          </View>
        )}
      </Pressable>
    </View>
  );
}

import { StyleSheet, TextInput, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  onChangeText: (text: string) => void;
};

export function InputField({
  label,
  value,
  placeholder,
  keyboardType = "default",
  onChangeText,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <AppText variant="caption" color="subtext">
        {label}
      </AppText>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.subtext}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  input: {
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardElevated,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.semibold,
    fontSize: 15,
  },
});

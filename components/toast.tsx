import React from "react";
import { StyleSheet, View, Pressable, Text, Platform, useWindowDimensions } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useToastStore, ToastType } from "@/store/use-toast-store";
import { theme } from "@/theme";

const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "sans-serif",
  default: "System",
});

export function Toast() {
  const { visible, title, message, type, action, hide } = useToastStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  if (!visible) return null;

  const getIconInfo = (t: ToastType) => {
    switch (t) {
      case "success":
        return { name: "check-circle" as const, color: "#10B981" }; // Standard success green
      case "error":
        return { name: "error" as const, color: "#EF4444" }; // Standard error red
      case "info":
      default:
        return { name: "info" as const, color: "#3B82F6" }; // Standard info blue
    }
  };

  const iconInfo = getIconInfo(type);
  const isTablet = width > 600;

  return (
    <Animated.View
      entering={SlideInUp.springify().mass(0.6).damping(15)}
      exiting={SlideOutUp.duration(200)}
      style={[
        styles.container,
        { top: insets.top + 16 },
        isTablet ? styles.containerTablet : styles.containerMobile,
      ]}
    >
      <View style={styles.content}>
        <MaterialIcons name={iconInfo.name} size={20} color={iconInfo.color} style={styles.icon} />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          {message ? (
            <Text style={styles.message} numberOfLines={4} ellipsizeMode="tail">
              {message}
            </Text>
          ) : null}
        </View>

        {action ? (
          <Pressable
            onPress={() => {
              action.onPress();
              hide();
            }}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={hide}
          style={styles.closeButton}
          accessibilityLabel="Close notification"
        >
          <MaterialIcons name="close" size={16} color={theme.colors.subtext} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  containerMobile: {
    left: 16,
    right: 16,
  },
  containerTablet: {
    right: 24,
    width: "100%",
    maxWidth: 360,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: "hidden",
    minHeight: 52,
    flexWrap: "nowrap",
  },
  icon: {
    marginRight: 12,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
    flexShrink: 1,
  },
  title: {
    fontFamily: systemFont,
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E2E1",
    lineHeight: 18,
  },
  message: {
    fontFamily: systemFont,
    fontSize: 12,
    fontWeight: "400",
    color: "#A0A0A0",
    lineHeight: 16,
    marginTop: 2,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "rgba(214, 175, 55, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(214, 175, 55, 0.2)",
    marginLeft: 8,
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontFamily: systemFont,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
    opacity: 0.7,
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

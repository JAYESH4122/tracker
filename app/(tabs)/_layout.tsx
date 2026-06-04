import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useWorkoutStore } from "@/store/use-workout-store";
import { theme } from "@/theme";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#E5C158";
const GLASS_BORDER = "rgba(255, 255, 255, 0.08)";

function DockButton({
  label,
  icon,
  active = false,
  onPress,
  compact = false,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  active?: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.dockItem, pressed && styles.dockPressed]}
    >
      <MaterialIcons
        name={icon}
        size={compact ? 24 : 26}
        color={active ? GOLD : "rgba(229, 226, 225, 0.5)"}
      />
      <Text
        style={[
          styles.dockLabel,
          compact && styles.dockLabelCompact,
          active && styles.dockLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  const isCompact = width < 390;
  const isSmall = width < 430;

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) {
    return null;
  }

  // Find active route name
  const activeRouteName = state.routes[state.index]?.name;

  const handleStartSession = () => {
    startWorkout("LEG DAY");
    router.push("/workout");
  };

  const handleFABPress = () => {
    if (activeWorkout) {
      router.push("/workout");
    } else {
      handleStartSession();
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.bottomShell,
        isSmall && styles.bottomShellCompact,
        { paddingBottom: Math.max(insets.bottom, 16) + 8 },
      ]}
    >
      <View style={styles.bottomShellInner}>
        <Pressable
          onPress={handleFABPress}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <LinearGradient
            colors={[GOLD_LIGHT, GOLD]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabInner}
          >
            <MaterialIcons name="add" size={32} color="#1A1A1A" />
          </LinearGradient>
        </Pressable>

        <View style={[styles.dock, isCompact && styles.dockCompact]}>
          <DockButton
            label="Home"
            icon="home"
            active={activeRouteName === "index"}
            compact={isCompact}
            onPress={() => navigation.navigate("index")}
          />
          <DockButton
            label="History"
            icon="history"
            active={activeRouteName === "history"}
            compact={isCompact}
            onPress={() => navigation.navigate("history")}
          />
          <View style={styles.dockSpacer} />
          <DockButton
            label="Stats"
            icon="analytics"
            active={activeRouteName === "stats"}
            compact={isCompact}
            onPress={() => navigation.navigate("stats")}
          />
          <DockButton
            label="Profile"
            icon="person"
            active={activeRouteName === "profile"}
            compact={isCompact}
            onPress={() => navigation.navigate("profile")}
          />
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={((props: BottomTabBarProps) => <CustomTabBar {...props} />) as any}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="workout" options={{ title: "Workout" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="library" options={{ title: "Library", href: null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", href: null }} />
      <Tabs.Screen name="stats" options={{ title: "Stats", href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomShell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    zIndex: 50,
  },
  bottomShellCompact: {
    paddingHorizontal: 16,
  },
  bottomShellInner: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: -32,
    zIndex: 60,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: GOLD,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
  },
  fabInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dock: {
    width: "100%",
    minHeight: 80,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  dockCompact: {
    minHeight: 72,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 28,
  },
  dockItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 44,
  },
  dockPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  dockSpacer: {
    flex: 1,
    minWidth: 64,
  },
  dockLabel: {
    color: "rgba(229, 226, 225, 0.5)",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "Anta_400Regular",
  },
  dockLabelCompact: {
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 1.6,
  },
  dockLabelActive: {
    color: GOLD,
  },
});

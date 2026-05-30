import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme";

function AnimatedTabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.15 : 1, { damping: 14, stiffness: 220 });
  }, [focused, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[style, { alignItems: "center", justifyContent: "center" }]}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Dynamic bottom padding and total height to fit safe areas on iOS and Android
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 10;
  const tabHeight = 52 + bottomPadding;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#7E8080",
        tabBarItemStyle: {
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 4,
          paddingBottom: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<
            string,
            [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]
          > = {
            index: ["home", "home-outline"],
            workout: ["barbell", "barbell-outline"],
            history: ["time", "time-outline"],
            library: ["library", "library-outline"],
          };
          const [activeIcon, inactiveIcon] = icons[route.name] ?? [
            "ellipse-outline",
            "ellipse-outline",
          ];
          return (
            <AnimatedTabIcon
              name={focused ? activeIcon : inactiveIcon}
              color={color as string}
              size={22}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="workout" options={{ title: "Workout" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="library" options={{ title: "Library" }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="stats" options={{ href: null }} />
    </Tabs>
  );
}

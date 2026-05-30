import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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
    scale.value = withSpring(focused ? 1.2 : 1, { damping: 12, stiffness: 220 });
  }, [focused, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

const TAB_HEIGHT = Platform.OS === "ios" ? 82 : 62;
const BOTTOM_PAD = Platform.OS === "ios" ? 28 : 10;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#131313",
          borderTopColor: "#3a3a3a",
          borderTopWidth: 1,
          height: TAB_HEIGHT,
          paddingBottom: BOTTOM_PAD,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: "#fde400",
        tabBarInactiveTintColor: "#636565",
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginTop: 2,
        },
        tabBarIcon: ({ color, size, focused }) => {
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
              size={size}
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
    </Tabs>
  );
}

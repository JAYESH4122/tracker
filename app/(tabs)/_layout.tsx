import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { theme } from "@/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 72,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.sm,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subtext,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.semibold,
          fontSize: 12,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: "home",
            workout: "barbell",
            stats: "stats-chart",
            profile: "person",
          };

          const iconName = iconByRoute[route.name] ?? "ellipse";
          return <Ionicons name={iconName} size={focused ? size + 1 : size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="workout" options={{ title: "Workout" }} />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

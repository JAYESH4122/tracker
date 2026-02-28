import { Tabs } from 'expo-router';
import { Colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card.primary,
          borderTopColor: Colors.card.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: Colors.accent.blue,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home',    tabBarIcon: () => null }} />
      <Tabs.Screen name="workout"  options={{ title: 'Log',     tabBarIcon: () => null }} />
      <Tabs.Screen name="planner"  options={{ title: 'Plan',    tabBarIcon: () => null }} />
      <Tabs.Screen name="analytics" options={{ title: 'Stats',  tabBarIcon: () => null }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile', tabBarIcon: () => null }} />
    </Tabs>
  );
}
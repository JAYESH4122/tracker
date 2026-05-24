import { StyleSheet, View } from "react-native";

import { StatCard } from "@/components/stat-card";
import { theme } from "@/theme";
import { StatItem } from "@/types/home";

type StatsRowProps = {
  stats: StatItem[];
};

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <View style={styles.row}>
      {stats.map((item) => (
        <StatCard key={item.id} label={item.label} value={item.value} iconName={item.iconName} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
});

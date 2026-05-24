import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { SectionHeader } from "@/components/section-header";
import { theme } from "@/theme";

type ChartCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card elevated style={styles.card}>
      <SectionHeader title={title} {...(subtitle ? { subtitle } : {})} />
      <View style={styles.content}>{children}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  content: {
    minHeight: 160,
    justifyContent: "center",
  },
});

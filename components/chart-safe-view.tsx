import { Component, PropsWithChildren, ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type ChartSafeViewProps = PropsWithChildren<{
  fallbackTitle?: string;
}>;

type ChartSafeViewState = {
  hasError: boolean;
};

class ChartErrorBoundary extends Component<ChartSafeViewProps, ChartSafeViewState> {
  public state: ChartSafeViewState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ChartSafeViewState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("Chart rendering failed:", error.message);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <AppText variant="sectionTitle">
            {this.props.fallbackTitle ?? "Chart unavailable"}
          </AppText>
          <AppText variant="caption" color="subtext">
            Your progress data is still available below.
          </AppText>
        </View>
      );
    }

    return this.props.children;
  }
}

export function ChartSafeView({ children, fallbackTitle }: ChartSafeViewProps) {
  if (Platform.OS === "web") {
    return (
      <View style={styles.fallback}>
        <AppText variant="sectionTitle">{fallbackTitle ?? "Chart unavailable on web"}</AppText>
        <AppText variant="caption" color="subtext">
          Open on iOS or Android to view interactive charts.
        </AppText>
      </View>
    );
  }

  return (
    <ChartErrorBoundary {...(fallbackTitle ? { fallbackTitle } : {})}>
      {children}
    </ChartErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fallback: {
    minHeight: 140,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
});

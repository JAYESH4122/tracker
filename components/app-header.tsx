import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type AppHeaderProps = {
  greeting: string;
  userName: string;
};

export function AppHeader({ greeting, userName }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <AppText variant="body" color="subtext">
        {greeting}
      </AppText>
      <AppText variant="display">{userName}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
});

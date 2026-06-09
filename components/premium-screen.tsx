import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, type PropsWithChildren, type ReactNode } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

const GOLD_LIGHT = "#E5C158";

const BG_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLu24nWykqZgevYWrQMAhU9O5LgBS6uhrv8kZkt-qWLqrh5ajV_SDAiglamnC3NvDMH372x4edKvbx-k-j25zf8loO3IpIH3g7jM30OqlaJ2uKaJCG4QX00E_wGUNrrE40-OQguDWv4lOa1w3f_83zHHR0vrk2-8bRDM3D9-V6CLshfW3OKB5q5wee_qT1yPfdtHL_YUU3tq5YfS0gCMGjqORk8K2HKT9bwdoeqgTW0bhM_XHw44gEaW9xg";
const BG_PATTERN_OVERLAY =
  "https://lh3.googleusercontent.com/aida/AP1WRLuF0eRL9PCMph4Zj755O_n42jVLK-BqtvU2PyCWoY_bl8GLgdfgTZ9NNQH25m3FjrrA0uZQT4fUfUR6t5ycREAzDR16XrX55UzRVxSEMDIeEIMx1pL1IrPUH4IZZ44CBEky-rBaMYUD-slms2jqlRBTXZqiZ_lMQOalXwLptSGMJA1vOA5rOaF13R9oBZF6PxRT-Bngvci6u-bqj-Te8YOULhF-mEI_uTL-wq7PCWh0ytfAFyVsZVzl5w";

type PremiumBackgroundProps = PropsWithChildren<{
  particles?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

type PremiumScrollScreenProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
  particles?: boolean;
  bottomInset?: number;
  reserveBottomDock?: boolean;
}>;

type PremiumHeaderProps = {
  title: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  onLeftPress?: () => void;
  right?: ReactNode;
};

type PremiumCardProps = PropsWithChildren<{
  accent?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

type PremiumMetricTileProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
  style?: StyleProp<ViewStyle>;
};

function Particle({ delay, height }: { delay: number; height: number }) {
  const left = useMemo(() => Math.random() * 100, []);
  const top = useMemo(() => Math.random() * 100, []);
  const size = useMemo(() => Math.random() * 3 + 1, []);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    const duration = Math.random() * 20000 + 30000;
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(withTiming(-(height + 140), { duration }), -1, false);
      opacity.value = withRepeat(withTiming(0.2, { duration: 2200 }), -1, true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, height, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

function GoldDustParticles() {
  const { height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 18 }).map((_, index) => (
        <Particle key={index} delay={index * 520} height={height} />
      ))}
    </View>
  );
}

export function PremiumBackground({ children, particles = true, style }: PremiumBackgroundProps) {
  return (
    <View style={[styles.root, style]}>
      <Image source={{ uri: BG_HERO_IMAGE }} resizeMode="cover" style={styles.backgroundImage} />
      <Image
        source={{ uri: BG_PATTERN_OVERLAY }}
        resizeMode="cover"
        style={styles.patternOverlay}
      />
      <LinearGradient
        colors={["rgba(15, 15, 15, 0.45)", "rgba(15, 15, 15, 0.9)"]}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill}
      />
      {particles ? <GoldDustParticles /> : null}
      {children}
    </View>
  );
}

export function PremiumScrollScreen({
  children,
  contentContainerStyle,
  particles = true,
  bottomInset = 32,
  reserveBottomDock = true,
}: PremiumScrollScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;

  return (
    <PremiumBackground particles={particles}>
      <ScrollView
        style={reserveBottomDock ? styles.dockReservedScroll : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isCompact ? styles.scrollContentCompact : null,
          {
            paddingTop: insets.top + 14,
            paddingBottom: bottomInset + Math.max(insets.bottom, 16),
          },
          contentContainerStyle,
        ]}
      >
        {children}
      </ScrollView>
    </PremiumBackground>
  );
}

export function PremiumHeader({
  title,
  leftIcon = "menu",
  onLeftPress,
  right,
}: PremiumHeaderProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 390;

  return (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
      <Pressable
        onPress={onLeftPress}
        disabled={!onLeftPress}
        style={({ pressed }) => [styles.iconButton, pressed && onLeftPress ? styles.pressed : null]}
      >
        <MaterialIcons name={leftIcon} size={24} color={theme.colors.primary} />
      </Pressable>

      <AppText
        variant="caption"
        style={[styles.headerTitle, isCompact ? styles.headerTitleCompact : null]}
      >
        {title}
      </AppText>

      <View style={styles.headerRight}>{right}</View>
    </Animated.View>
  );
}

export function PremiumDivider() {
  return (
    <LinearGradient
      colors={["transparent", "rgba(212, 175, 55, 0.14)", "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.divider}
    />
  );
}

export function PremiumCard({ children, accent = false, onPress, style }: PremiumCardProps) {
  const cardStyle = [styles.card, accent ? styles.cardAccent : null, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed ? styles.pressedCard : null]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

export function PremiumMetricTile({
  icon,
  label,
  value,
  sublabel,
  accent = false,
  style,
}: PremiumMetricTileProps) {
  return (
    <PremiumCard accent={accent} style={[styles.metricTile, style]}>
      <MaterialIcons
        name={icon}
        size={18}
        color={accent ? theme.colors.primary : "rgba(212, 175, 55, 0.62)"}
      />
      <AppText
        variant="statValue"
        style={styles.metricValue}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {value}
      </AppText>
      <AppText
        variant="caption"
        color="subtext"
        style={styles.metricLabel}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {label}
      </AppText>
      {sublabel ? (
        <AppText variant="caption" color="primary" style={styles.metricSublabel} numberOfLines={1}>
          {sublabel}
        </AppText>
      ) : null}
    </PremiumCard>
  );
}

export function PremiumPrimaryAction({
  children,
  onPress,
  icon = "chevron-right",
  style,
}: PropsWithChildren<{
  icon?: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.primaryAction, pressed ? styles.pressedCard : null, style]}
    >
      <LinearGradient
        colors={[GOLD_LIGHT, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryActionInner}
      >
        <MaterialIcons name={icon} size={20} color={theme.colors.background} />
        <AppText variant="button" color="background" style={styles.primaryActionText}>
          {children}
        </AppText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    opacity: 0.34,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.14,
  },
  particle: {
    position: "absolute",
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  scrollContentCompact: {
    paddingHorizontal: 16,
    gap: 16,
  },
  dockReservedScroll: {
    marginBottom: 32,
  },
  header: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: theme.colors.text,
    fontFamily: "Anta_400Regular",
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
    flex: 1,
  },
  headerTitleCompact: {
    fontSize: 18,
    letterSpacing: 2.2,
  },
  headerRight: {
    width: 44,
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(28, 28, 28, 0.82)",
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 4,
  },
  cardAccent: {
    borderColor: "rgba(212, 175, 55, 0.18)",
    backgroundColor: "rgba(36, 36, 36, 0.86)",
  },
  pressed: {
    opacity: 0.86,
  },
  pressedCard: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  metricTile: {
    flex: 1,
    minWidth: 0,
    padding: 14,
    gap: 4,
  },
  metricValue: {
    color: theme.colors.text,
    fontFamily: "Anta_400Regular",
    fontSize: 22,
    lineHeight: 28,
  },
  metricLabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  metricSublabel: {
    fontFamily: "Anta_400Regular",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  primaryAction: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryActionInner: {
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryActionText: {
    fontFamily: "Anta_400Regular",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

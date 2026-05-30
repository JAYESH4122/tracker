import { TextStyle } from "react-native";

export const fontFamilies = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  narrowBold: "ArchivoNarrow_700Bold",
  narrowSemiBold: "ArchivoNarrow_600SemiBold",
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.narrowBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: fontFamilies.narrowBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  sectionTitle: {
    fontFamily: fontFamilies.narrowSemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: fontFamilies.narrowBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
  },
  button: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
} as const satisfies Record<string, TextStyle>;

import { TextStyle } from "react-native";

export const fontFamilies = {
  regular: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extrabold: "Manrope_800ExtraBold",
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.extrabold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  statValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  button: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
} as const satisfies Record<string, TextStyle>;

import { colors } from "./colors";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { fontFamilies, typography } from "./typography";

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  fonts: fontFamilies,
} as const;

export type AppTheme = typeof theme;

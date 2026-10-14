import { palette, surfaces } from './design';

// Compatibility keys for existing screens; new primitives use semantic roles.
export default {
  background: palette.navy, surface: palette.surface, surfaceLight: palette.raised,
  primary: palette.legacyPrimary, primaryDark: palette.legacyPrimaryPressed,
  brand: palette.orange, onBrand: palette.navy,
  secondary: palette.orange, secondaryDark: palette.orangePressed,
  text: surfaces.dark.text, textSecondary: surfaces.dark.muted, textMuted: surfaces.dark.muted,
  border: surfaces.dark.boundary, success: palette.success, error: palette.error,
  warning: palette.warning, white: palette.white, black: palette.black,
};

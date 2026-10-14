import { Text as NativeText, StyleSheet, type TextProps } from 'react-native';
import { isLoaded } from 'expo-font';
import { fonts, surfaces, typography, type SurfaceTone } from '@/constants/design';
import { presentationFont } from '@/components/foundation/font-policy';

// Preserve the app font through public props instead of patching Text internals.
export default function AppText({ style, variant, tone, ...props }: TextProps & {
  variant?: keyof typeof typography; tone?: SurfaceTone;
}) {
  // Existing callers own size/line height. Opt-in variants avoid clipping their titles.
  const base = variant ? typography[variant] : { fontFamily: fonts.body };
  const requested = StyleSheet.flatten(style)?.fontFamily ?? base.fontFamily;
  return <NativeText {...props} allowFontScaling={props.allowFontScaling ?? true}
    style={[base, tone && { color: surfaces[tone].text }, style,
      { fontFamily: presentationFont(requested, isLoaded) }]} />;
}

import { StyleSheet } from 'react-native';
import type { ComponentProps } from 'react';
import Text from '@/components/AppText';
import { useSurfaceTone } from '@/components/foundation/Primitives';
import { fonts, palette, surfaces, typography } from '@/constants/design';

// Adapt legacy kit text styles to the existing Panel surface context.
export default function GameText({ style, ...props }: ComponentProps<typeof Text>) {
  const colors = surfaces[useSurfaceTone()];
  const flattened = StyleSheet.flatten(style);
  const color = flattened?.color;
  const foreground = color === palette.orange && colors.text === palette.navy ? palette.navy : color === palette.muted ? colors.muted :
    color === palette.error ? colors.error : color === palette.success ? colors.success :
      color === palette.text || color === palette.white || !color ? colors.text : color;
  const heading = flattened?.fontFamily === fonts.label && flattened.fontSize === typography.section.fontSize;
  const isHeading = heading || props.variant === 'display' || flattened?.fontFamily === fonts.display;
  return <Text {...props} accessibilityRole={props.accessibilityRole ?? (isHeading ? 'header' : undefined)}
    style={[style, heading && { fontFamily: fonts.display }, { color: foreground }]} />;
}

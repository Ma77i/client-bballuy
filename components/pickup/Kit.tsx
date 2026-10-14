// Compatibility exports keep existing screens on the shared presentation layer.
import { palette, surfaces } from '@/constants/design';
import { Field, Notice, StateView } from '@/components/foundation/Primitives';
import type { ActivityIndicatorProps } from 'react-native';
import { errorText } from './error-copy';
import type { ComponentProps } from 'react';
export { Button as GameButton, Choice as GameChoice, Field as GameField,
  Panel as GamePanel, Notice as GameNotice } from '@/components/foundation/Primitives';
export { foundationStyles as kit } from '@/components/foundation/styles';
export const gameColors = { ink: palette.navy, panel: palette.surface,
  muted: surfaces.dark.muted, orange: palette.orange, border: surfaces.dark.boundary };
export function ArcadeField(props: ComponentProps<typeof Field>) {
  return <Field {...props} error={errorText(props.error)} />;
}
export function ArcadeNotice({ children, ...props }: ComponentProps<typeof Notice>) {
  return <Notice {...props}>{typeof children === 'string' ? errorText(children) : children}</Notice>;
}
export function GameLoading({ accessibilityLabel }: ActivityIndicatorProps) {
  return <StateView title={accessibilityLabel ?? 'Cargando información'} loading />;
}

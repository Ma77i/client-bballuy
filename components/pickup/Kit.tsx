// Compatibility exports keep existing screens on the shared presentation layer.
import { palette, surfaces } from '@/constants/design';
export { Button as GameButton, Choice as GameChoice, Field as GameField,
  Panel as GamePanel, Notice as GameNotice } from '@/components/foundation/Primitives';
export { foundationStyles as kit } from '@/components/foundation/styles';
export const gameColors = { ink: palette.navy, panel: palette.surface,
  muted: surfaces.dark.muted, orange: palette.orange, border: surfaces.dark.boundary };
